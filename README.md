# 🥗 Canteen Management System — MERN Stack Project

🔗 **Live Demo**: [https://cms-1-gy5c.onrender.com](https://cms-1-gy5c.onrender.com)

---

## 🧠 What is this project?

The **Canteen Management System** is a full-stack **MERN** application tailored for student groups to:

- 🧾 Split canteen bills **fairly and transparently**
- 📆 Coordinate academic deadlines & events
- 👥 Build a trusted group space using **Clerk**-powered authentication

A perfect blend of **expense tracker** and **academic planner** — all in one platform! 🚀

---

## 🔐 Authentication & Access Control

Authentication is powered by [**Clerk**](https://clerk.dev), offering seamless and secure login options:

✅ Supported Login Methods:
- 📧 Email
- 📱 Phone Number
- 🧑‍💼 GitHub
- 🌐 LinkedIn
- 📬 Gmail

🔒 **Protected Routes** (Require login):
- `/group`
- `/calendar`
- `/members`

🔓 **Public Routes**:
- `/home`
- `/about-creator`

---

## 📄 Pages Breakdown

### 1. 🧾 Group Page

Create or join a canteen group in just **3 simple steps**:

1. **Enter Group Details** – name, location, date, and who paid 🧍‍♂️
2. **Add Items** – specify what was ordered 🍽
3. **Assign Consumption** – assign items to members and auto-calculate individual expenses 💸

✨ **Special Features**:
- Group creator or payer can:
  - Toggle **Paid** / **Pending** status ✅❌
  - Hit **"Poke"** to send payment reminders via email 📬

---

### 2. 📆 Calendar Page

Plan and manage group academic events together!

- Add/Edit events collaboratively 📝
- Only the **creator** can delete the calendar ❌🗓
- Supported event types:
  - **QUIZ**
  - **MEETING**
  - **DEADLINE**
  - **OTHER**

---

### 3. 👥 Members Page

See who’s on the platform! 🔍

Each member profile includes:
- Name
- Email
- Phone Number
- Department
- Roll Number
- Optional Profile Image 🖼

---

### 4. 🧑‍💻 About Creator Page

A fun little page with an Easter egg feature — click **"Know about me"** to summon some surprise info about the dev 😄

---

## 🧰 Tech Stack

### 💻 Frontend
- React.js ⚛️
- Tailwind CSS 🎨
- Clerk Authentication 🔐
- Lucide React (Icons) 🎯

### 🖥 Backend
- Node.js & Express.js 🚀
- MongoDB with Mongoose 🍃
- Nodemailer 📧 (for sending “Poke” emails)

### ☁️ Deployment
- Hosted on [Render](https://render.com)

---

## 🗃 MongoDB Schema Overview

### 🧾 Group Management
- `GroupDetailsSchema`: group name, location, date, payer
- `ItemSchema`: item name, quantity, price
- `MemberExpenseSchema`: who ate what, how much, and payment status
- `GEMmodel` & `GEMmodel2`: combined group expense data

### 📆 Calendar Events
- `CalendarEventSchema`: title, date, type, and description
- `CalendarGroup`: groupName, members, events, createdBy

### 👤 Student Profiles
- `StudentProfile`: userId, name, email, phone, roll number, department, year, bio, connections, profile image

---

## 🖼 Suggested Screenshots

- 🔐 Clerk Login Page![image](https://github.com/user-attachments/assets/b7c34638-e0ab-41c8-b664-8414d7b102fc)
- ![image](https://github.com/user-attachments/assets/165bbea4-a5da-4c76-9356-1e455187fd5b)


- 🏠 Home Page![screenshot (5)](https://github.com/user-attachments/assets/95ce59b3-9e34-4e56-9b66-0415fb67e318)

- 🧾 Group Creation Wizard (3-step UI)![image](https://github.com/user-attachments/assets/4c6cf9f2-56ea-43b2-a3c6-a531618177ae)

- 📬 Email Confirmation (Poke feature)![image](https://github.com/user-attachments/assets/8d1eb4c4-9e43-4952-ba56-b5f4eb838a88)

- 📆 Calendar with Events![image](https://github.com/user-attachments/assets/dd1b0285-78ea-4518-8d10-6af791bfacd1)

- 👥 Members List!![image](https://github.com/user-attachments/assets/c5977dfd-8627-4458-8378-fb2b5ad0d924)


- 🧑‍💻 About Creator Page -- I just wanted to Prank my friends. so I have added a yt link to this never mind if you clisked it by mistake

---

## 🔮 What's Next? (Future Enhancements)

Here are some features we're excited to add:

- 🤝 Friend request & social-style connection system
- 🔒 Private groups (invitation-based creation)
- 🔔 Real-time notifications
- 📝 More Features in profiles like custom avatars
- 📱 Better mobile UI + dark mode 🌙

---

## 👨‍💻 Meet the Creator

> This platform was built with 💖 by **Kuladeep Reddy Chappidi** to help students **organize canteen expenses** and **collaborate on academic tasks** more efficiently.

Let’s make college life a little easier — and tastier! 🥘🎓

---
