const axios = require('axios');
const XLSX = require('xlsx');
const path = require('path');
const jwt = require('jsonwebtoken');
const Student = require('../model/Student')

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

    studentGetall: async(req, res) => {
        try{
            const getAllStudents = await Student.find()
            
            return res.json({ Result: getAllStudents })
        }   
        catch(err){
            console.log(err)
        }
    }

};

module.exports = StudentController;