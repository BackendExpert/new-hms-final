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
    createstdviaSheet: async(req, res) => {
        try{

        }
        catch(err){
            console(err)
        }
    }
};

module.exports = StudentController;