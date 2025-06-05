import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaFemale, FaGraduationCap, FaMale } from 'react-icons/fa';
import localStorage from 'react-secure-storage';
import DefaultInput from '../../components/Form/DefaultInput';
import DefaultBtn from '../../components/Buttons/DefaultBtn';
import { getUserInfoFromToken } from '../../utils/auth';

const WardenStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [assigningAll, setAssigningAll] = useState(false);
  const recordsPerPage = 15;

  const token = localStorage.getItem('login');
  const currentUser = useMemo(() => getUserInfoFromToken(), []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!token || !currentUser?.email) {
        setError('Unauthorized: Missing token or user info.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const url = `${import.meta.env.VITE_APP_API}/hostel/warden-students?wardenEmail=${encodeURIComponent(currentUser.email)}`;
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStudents(res.data.Result || []);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to fetch student data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token, currentUser.email]);

  const handleAssignStudent = async (studentId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API}/room/student-assign-to-rooms`,
        {
          studentId,
          wardenEmail: currentUser.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert('Student assigned successfully!');
        setStudents((prev) =>
          prev.map((s) => (s._id === studentId ? { ...s, isAssign: true } : s))
        );
      } else {
        alert(res.data.message || 'Assignment failed.');
      }
    } catch (error) {
      console.error('Error assigning student:', error);
      alert('Error assigning student.');
    }
  };

  // Assign all unassigned students
  const handleAssignAll = async () => {
    const unassignedStudents = students.filter((s) => !s.isAssign);
    if (unassignedStudents.length === 0) {
      alert('All students are already assigned.');
      return;
    }

    if (!window.confirm(`Assign all ${unassignedStudents.length} unassigned students?`)) {
      return;
    }

    setAssigningAll(true);

    try {
      // Assign students one by one or via batch API if available
      // Here, assigning one by one:
      for (const student of unassignedStudents) {
        await axios.post(
          `${import.meta.env.VITE_APP_API}/hostel/assign-student`,
          {
            studentId: student._id,
            wardenEmail: currentUser.email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      alert('All unassigned students assigned successfully!');

      // Update state to mark all assigned
      setStudents((prev) =>
        prev.map((s) => ({ ...s, isAssign: true }))
      );
    } catch (error) {
      console.error('Error assigning all students:', error);
      alert('Failed to assign all students.');
    } finally {
      setAssigningAll(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const term = searchTerm.toLowerCase();
    return (
      student.nic?.toLowerCase().includes(term) ||
      student.enrolmentNo?.toLowerCase().includes(term) ||
      student.indexNo?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredStudents.length / recordsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [searchTerm, totalPages]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

  return (
    <div className="mt-8">
      <div className="mb-4 font-semibold text-gray-700">
        Logged in as: {currentUser?.email || 'Unknown Warden'}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
        <div className="relative bg-emerald-600 text-white p-6 rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute right-4 top-4 opacity-20 text-white text-6xl">
            <FaGraduationCap />
          </div>

          <div className="relative z-10">
            <div className="text-sm font-medium uppercase tracking-wide text-emerald-100">
              Roles (User Types)
            </div>
            <div className="mt-2 text-3xl font-bold">{students.length}</div>
          </div>
        </div>
      </div>

      <DefaultInput
        label="Search by NIC, Enrolment No, or Index No"
        name="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Type NIC, Enrolment No or Index No"
      />

      <div className="ml-2 my-4 max-w-xs">
        <DefaultBtn
          label={assigningAll ? 'Assigning All...' : 'Assign All Students'}
          onClick={handleAssignAll}
          disabled={assigningAll}
          type="button"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-lg">
        <table className="min-w-full text-sm text-left text-gray-600 bg-white">
          <thead className="text-xs uppercase bg-emerald-100 text-emerald-700">
            <tr>
              <th className="px-6 py-4 font-semibold">#</th>
              <th className="px-6 py-4 font-semibold">Enrolment No</th>
              <th className="px-6 py-4 font-semibold">Index No</th>
              <th className="px-6 py-4 font-semibold">NIC</th>
              <th className="px-6 py-4 font-semibold">Gender</th>
              <th className="px-6 py-4 font-semibold">Home Town</th>
              <th className="px-6 py-4 font-semibold">Distance</th>
              <th className="px-6 py-4 font-semibold">Hostel Assigned</th>
              <th className="px-6 py-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student, idx) => {
                const gender = (student.sex || '').toLowerCase();
                return (
                  <tr
                    key={student._id || idx}
                    className="hover:bg-emerald-50 transition-all duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {(currentPage - 1) * recordsPerPage + idx + 1}
                    </td>
                    <td className="px-6 py-4">{student.enrolmentNo || '-'}</td>
                    <td className="px-6 py-4">{student.indexNo || '-'}</td>
                    <td className="px-6 py-4">{student.nic || '-'}</td>
                    <td className="px-6 py-4">
                      {gender === 'male' ? (
                        <span className="flex uppercase bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full gap-1 items-center">
                          <FaMale className="h-4 w-auto" />
                          Male
                        </span>
                      ) : gender === 'female' ? (
                        <span className="flex uppercase bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full gap-1 items-center">
                          <FaFemale className="h-4 w-auto" />
                          Female
                        </span>
                      ) : (
                        <span className="uppercase bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                          Unknown
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{student.address3 || '-'}</td>
                    <td className="px-6 py-4">{student.distance ?? '-'}</td>
                    <td className="px-6 py-4">
                      {student.isAssign ? (
                        <span className="uppercase bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                          Assigned
                        </span>
                      ) : (
                        <span className="uppercase bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                          Not Assigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <Link
                        to={`/Dashboard/View-Student/${student._id}`}
                        className="text-emerald-600 font-medium hover:underline"
                      >
                        View
                      </Link>

                      {!student.isAssign && (
                        <button
                          onClick={() => handleAssignStudent(student._id)}
                          className="text-blue-600 font-medium hover:underline"
                        >
                          Assign
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-4 text-gray-700">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-emerald-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-emerald-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default WardenStudents;
