
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Student = require('../models/Student')

const router = express.Router()

// Register a new student
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body

    if (!fullName?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required.',
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters.',
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingStudent = await Student.findOne({
      email: normalizedEmail,
    })

    if (existingStudent) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const student = await Student.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    })

    return res.status(201).json({
      message: 'Registration successful!',
      student: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
      },
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      })
    }

    console.error('Registration error:', error.message)

    return res.status(500).json({
      message: 'Registration failed. Please try again.',
    })
  }
})

// Log in an existing student
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
      })
    }

    const student = await Student.findOne({
      email: email.trim().toLowerCase(),
    }).select('+password')

    if (!student) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      })
    }

    const passwordMatches = await bcrypt.compare(
      password,
      student.password
    )

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      })
    }

    const token = jwt.sign(
      { studentId: student._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    )

    return res.json({
      message: 'Login successful!',
      token,
      student: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
      },
    })
  } catch (error) {
    console.error('Login error:', error.message)

    return res.status(500).json({
      message: 'Login failed. Please try again.',
    })
  }
})

module.exports = router
