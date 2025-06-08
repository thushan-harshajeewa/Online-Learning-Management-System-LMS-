# 🌐 Full-Stack Web App: React + Django

![GitHub License](https://img.shields.io/github/license/thushan-harshajeewa/Online-Learning-Management-System-LMS-?style=flat-square)
![Last Commit](https://img.shields.io/github/last-commit/thushan-harshajeewa/Online-Learning-Management-System-LMS-?style=flat-square)
![Issues](https://img.shields.io/github/issues/thushan-harshajeewa/Online-Learning-Management-System-LMS-?style=flat-square)

A modern full-stack web application built with **React** on the frontend and **Django** on the backend. This monorepo structure makes it easy to manage, develop, and deploy both services together.

---

## 📁 Project Structure

```
my-webapp/
├── Frontend-Student/         # React app (Vite)
├── Frontend-Lecture/         # React app (Vite)
├── Backend/                  # Django app (REST API)
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### 🖼️ Frontend-Student (React)

> Located in the `/Frontend-Student` directory

#### 🔧 Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm or yarn

#### 🛠️ Installation & Development

```bash
cd Frontend-Student
npm install           # or yarn
npm run dev           # or npm start
```

#### 🌐 Default URL:

```
http://localhost:5173/

```

> You can update the port or API endpoint in `.env` and `vite.config.js`.

---

### 🖼️ Frontend-Lecture (React)

> Located in the `/Frontend-Lecture` directory

#### 🔧 Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm or yarn

#### 🛠️ Installation & Development

```bash
cd Frontend-Lecture
npm install           # or yarn
npm run dev           # or npm start
```

#### 🌐 Default URL:

```
http://localhost:5173/
```

> You can update the port or API endpoint in `.env` and `vite.config.js`.

---

### 🧩 Backend (Django)

> Located in the `/backend` directory

#### 🔧 Prerequisites

- Python 3.9+
- pip
- Virtualenv (recommended)

#### 🛠️ Installation & Development

```bash
cd backend
# Initalise virtual env and Dependecies
pipenv install

# Run migrations
python manage.py migrate

# Start the development server
python manage.py runserver
```

#### 🌐 Default URL:

```
http://127.0.0.1:8000/
```

---

## 🔁 Connecting Frontend to Backend

Make sure the frontend can communicate with the Django backend.

1. In `/frontend/.env`, add:

```env
VITE_API_URL=http://127.0.0.1:8000/api/
```

2. Install CORS middleware in Django:

```bash
pip install django-cors-headers
```

3. Update `backend/settings.py`:

```python
INSTALLED_APPS += ['corsheaders']
MIDDLEWARE.insert(0, 'corsheaders.middleware.CorsMiddleware')
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

---

## 🧪 Tech Stack

| Layer    | Technology                               |
| -------- | ---------------------------------------- |
| Frontend | React, Vite (or Create React App), Axios |
| Backend  | Django, Django REST Framework            |
| Styling  | Tailwind CSS or plain CSS                |
| Database | SQLite (default), PostgreSQL (optional)  |
| Auth     | Django built-in or JWT                   |

---

---

## 📦 Deployment Tips

- **Frontend** can be deployed on [Vercel](https://vercel.com/), [Netlify](https://netlify.com/), or [Firebase Hosting](https://firebase.google.com/).
- **Backend** can be deployed on [Render](https://render.com/), [Railway](https://railway.app/), or Docker/Heroku setups.
- Make sure to set up environment variables and allowed hosts accordingly.

---

## 📸 Screenshots

> _You can add some screenshots here of your UI, API docs, or admin panel for better visibility._

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/thushan-harshajeewa/Online-Learning-Management-System-LMS-/issues).

1. Fork the repo
2. Create your branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

---

## 🛡️ License

This project is licensed under the [MIT License](./LICENSE).

---

## 📬 Contact

Have questions, suggestions, or feedback?  
Feel free to reach out at [thushan1728@gmail.com](mailto:thushan1728@gmail.com) or open a GitHub issue.

---

### 🫶 Built with passion by [Thushan Liyanage](https://github.com/thushan-harshajeewa)
