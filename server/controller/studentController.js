const axios = require('axios');
const XLSX = require('xlsx');
const path = require('path');
const jwt = require('jsonwebtoken');
const Student = require('../model/Student');
const SpecialNeeds = require('../model/SpecialNeeds');
const EmergencyContact = require('../model/EmergencyContact');

// Geocoding function using OpenCage API
async function geocodeWithOpenCage(address) {
    try {
        const apiKey = process.env.OPENCAGE_API_KEY;
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

        const response = await axios.get(url);
        const result = response.data.results[0];
        return result ? { lat: result.geometry.lat, lng: result.geometry.lng } : null;
    } catch (error) {
        console.error(`OpenCage error for "${address}":`, error.message);
        return null;
    }
}

// Function to calculate road distance using OSRM
async function getRoadDistanceOSRM(start, end) {
    try {
        const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=false&alternatives=false&steps=false`;

        const response = await axios.get(osrmUrl);
        const distance = response.data.routes[0].legs[0].distance;
        return distance / 1000; // km
    } catch (error) {
        console.error('Error getting road distance from OSRM:', error.message);
        return null;
    }
}


const StudentController = {
    createstdviaSheet: async (req, res) => {
        try {
            const filePath = req.file.path;
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const studentsFromExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const universityAddress = "University of Peradeniya, Peradeniya, Kandy, Sri Lanka";
            const universityCoords = await geocodeWithOpenCage(universityAddress);

            const insertedStudents = [];
            const duplicateStudents = [];

            for (const s of studentsFromExcel) {
                const exists = await Student.findOne({
                    $or: [
                        { enrolmentNo: s['Enrolment_No.'] },
                        { indexNo: s['Index_No'] },
                        { nic: s['NIC'] },
                        { email: s['email'] }
                    ]
                });

                if (exists) {
                    duplicateStudents.push(s['Enrolment_No.']);
                    continue;
                }

                const studentData = {
                    no: s['No'],
                    enrolmentNo: s['Enrolment_No.'],
                    indexNo: s['Index_No'],
                    name: s['Name'],
                    title: s['Title'],
                    lastName: s['L_Name'],
                    initials: s['Initials'],
                    fullName: s['Full_Name'],
                    alDistrict: s['alDistrict'],
                    sex: s['Sex'],
                    zScore: parseFloat(s['Z_Score']),
                    medium: s['Medium'],
                    nic: s['NIC'],
                    address1: s['ADD1'],
                    address2: s['ADD2'],
                    address3: s['ADD3'],
                    fullAddress: s['Address'],
                    email: s['email'],
                    phone1: s['Phone_No'],
                    phone2: s['Phone_No_2'] || '',
                    genEnglishMarks: s['Gen_English_Marks'] ? parseInt(s['Gen_English_Marks']) : null,
                    intake: s['Intake'],
                    dateOfEnrolment: s['Date_of_Enollment'],
                    distance: null
                };

                // Use only ADD3 to get distance
                const add3 = s['ADD3'];
                if (add3 && universityCoords) {
                    const studentCoords = await geocodeWithOpenCage(add3);
                    if (studentCoords) {
                        const distanceKm = await getRoadDistanceOSRM(studentCoords, universityCoords);
                        if (distanceKm !== null) {
                            studentData.distance = parseFloat(distanceKm.toFixed(2));
                        }
                    }
                }

                insertedStudents.push(studentData);
            }

            await Student.insertMany(insertedStudents);

            res.json({
                Status: "Success",
                Message: 'Upload complete',
                insertedCount: insertedStudents.length,
                duplicateCount: duplicateStudents.length,
                duplicates: duplicateStudents
            });
        }
        catch (err) {
            console(err)
        }
    },

    createStudentManually: async (req, res) => {
        try {
            const {
                enrolmentNo,
                indexNo,
                name,
                title,
                lastName,
                initials,
                fullName,
                alDistrict,
                sex,
                zScore,
                medium,
                nic,
                address1,
                address2,
                address3,
                fullAddress,
                email,
                phone1,
                phone2,
                genEnglishMarks,
                intake,
                dateOfEnrolment,
                distance
            } = req.body;


            const existingStudent = await Student.findOne({
                $or: [
                    { enrolmentNo },
                    { indexNo },
                    { nic },
                    { email }
                ]
            });

            if (existingStudent) {
                return res.json({ error: "Student already exists with the provided enrolment number, index number, NIC, or email." });
            }

            const newStudent = new Student({
                enrolmentNo,
                indexNo,
                name,
                title,
                lastName,
                initials,
                fullName,
                alDistrict,
                sex,
                zScore,
                medium,
                nic,
                address1,
                address2,
                address3,
                fullAddress,
                email,
                phone1,
                phone2,
                genEnglishMarks,
                intake,
                dateOfEnrolment,
                distance
            });

            await newStudent.save();

            return res.json({ Status: "Success", message: "Student created successfully", student: newStudent });
        } catch (err) {
            console.error("Error creating student:", err);
            return res.json({ error: "Internal server error" });
        }
    },

    studentGetall: async (req, res) => {
        try {
            const getAllStudents = await Student.find()

            return res.json({ Result: getAllStudents })
        }
        catch (err) {
            console.log(err)
        }
    },

    getStudentById: async (req, res) => {
        try {
            const { id } = req.params

            const findStudent = await Student.findById(id)

            res.json({ Result: findStudent })
        }
        catch (err) {
            console.log(err)
        }
    },

    updateStudent: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                name,
                title,
                lastName,
                initials,
                fullName,
                alDistrict,
                sex,
                zScore,
                medium,
                address1,
                address2,
                address3,
                fullAddress,
                phone1,
                phone2,
                genEnglishMarks,
                intake,
                dateOfEnrolment,
                distance
            } = req.body;

            const updatedStudent = await Student.findByIdAndUpdate(
                id,
                {
                    name,
                    title,
                    lastName,
                    initials,
                    fullName,
                    alDistrict,
                    zScore,
                    medium,
                    address1,
                    address2,
                    address3,
                    fullAddress,
                    phone1,
                    phone2,
                    genEnglishMarks,
                    intake,
                    dateOfEnrolment,
                    distance
                },
                { new: true }
            );

            if (!updatedStudent) {
                return res.json({ message: 'Student not found' });
            }

            res.json({ Status: "Success", Message: 'Student updated successfully', student: updatedStudent });
        } catch (err) {
            console.error(err);
            res.json({ message: 'Internal server error' });
        }
    },



    StudentCreateNeeds: async (req, res) => {
        try {
            const { regNo, needs } = req.body;

            if (!regNo || !needs) {
                return res.json({ Error: 'regNo and needs are required.' });
            }

            const getstdId = await Student.findOne({ email: regNo })

            const newSpecialNeeds = new SpecialNeeds({
                regNo: getstdId._id,
                needs,
            });

            await newSpecialNeeds.save();

            return res.json({ Status: 'Success', Message: 'Special needs submitted successfully!' });
        } catch (err) {
            console.error('Error saving special needs:', err);
            return res.json({ Error: 'Internal server error' });
        }
    },

    studentAddEmergencyContact: async (req, res) => {
        try {
            const {
                regNo,
                firstName,
                surname,
                relationship,
                telNo,
                address,
                active
            } = req.body;

            if (!regNo) {
                return res.json({ message: 'User email (regNo) is required' });
            }

            // Check if emergency contact exists for this regNo
            const existingContact = await EmergencyContact.findOne({ regNo });

            if (existingContact) {
                // Update existing contact
                existingContact.firstName = firstName;
                existingContact.surname = surname;
                existingContact.relationship = relationship;
                existingContact.telNo = telNo;
                existingContact.address = address;
                existingContact.active = active;

                await existingContact.save();

                return res.json({
                    Status: "Success",
                    Message: 'Emergency contact updated successfully',
                });
            } else {
                // Create a new EmergencyContact document if not found
                const newContact = new EmergencyContact({
                    regNo,
                    firstName,
                    surname,
                    relationship,
                    telNo,
                    address,
                    active
                });

                await newContact.save();

                return res.json({
                    Status: "Success",
                    Message: 'Emergency contact saved successfully',
                });
            }

        } catch (err) {
            console.error('Error saving emergency contact:', err);
            return res.json({ message: 'Internal server error' });
        }
    },

    getEmergencyContact: async (req, res) => {
        try {
            const { regNo } = req.query;
            if (!regNo) {
                return res.json({ Error: 'regNo query parameter is required' });
            }

            const emergencyContact = await EmergencyContact.findOne({ regNo, active: true }).lean();

            if (!emergencyContact) {
                return res.json({ Error: 'No emergency contact found' });
            }

            res.json({ Status: 'Success', emergencyContact });
        } catch (err) {
            console.error(err);
            res.json({ Error: 'Server error' });
        }
    },

    getNeedsStudents: async (req, res) => {
        try {
            const { email } = req.params;

            if (!email) {
                return res.json({ Status: 'Fail', Error: 'Email parameter is required' });
            }

            const stdID = await Student.findOne({ email: email })

            const specialNeeds = await SpecialNeeds.find({ regNo: stdID._id });

            if (!specialNeeds) {
                return res.json({ Status: 'Fail', Error: 'No special needs found for this user' });
            }

            return res.json({ Status: 'Success', Data: specialNeeds });
        } catch (err) {
            console.error('Error fetching special needs by email:', err);
            return res.json({ Status: 'Fail', Error: 'Internal server error' });
        }
    }

};

module.exports = StudentController;