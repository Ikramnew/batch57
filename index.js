const express = require("express");
const path = require("path");
const config = require("./config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const bcrypt = require('bcryptjs');
const Project = require('./models/project'); 
const User = require('./models/user'); 
const saltRounds = 10;
const app = express();
const port = 3000;
const session = require('express-session');
const sequelize = new Sequelize(config.development);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));
app.use("/assets", express.static(path.join(__dirname, "./assets")));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'ikram', 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000*60*60*24} 

}));
app.use((req, res, next) => {
    console.log('Session Data:', req.session);
    next(); // Proceed to the next middleware or route handler
});
// Routing
app.get("/", home);
app.get("/contact", contact);
app.get("/testimonial", testimonial);
app.get("/addproject", project);
app.get("/project", projectShow);
app.get("/delete-project/:id", projectDelete);
app.get("/edit-project/:id", projectEditView);
app.post("/edit-project/:id", projectEdit);
app.get("/detail-project/:id", projectDetail);
app.post("/project", postProject);
app.get("/login",loginView);
app.get("/register",registerView);
app.post("/register", register);
app.post("/login", login);
app.get("/logout", logout);


async function register(req, res) {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await sequelize.query(
            'INSERT INTO users (name, email, password) VALUES (:name, :email, :password)',
            {
                replacements: { name, email, password: hashedPassword },
                type: QueryTypes.INSERT
            }
        );
        res.redirect('/login');
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error registering user");
    }
}




async function login(req, res) {
    const { email, password } = req.body;
    const sequelize = new Sequelize(config.development);

    try {
        // Query to find user by email
        const [user] = await sequelize.query(
            'SELECT * FROM users WHERE email = :email',
            {
                replacements: { email },
                type: QueryTypes.SELECT
            }
        );

        if (!user) {
            req.session.errorMessage = 'User not found';
            return res.redirect('/login');
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.session.errorMessage = 'Incorrect password';
            return res.redirect('/login');
        }

        // Successful login: Store user info in session
        req.session.user = { id: user.id, email: user.email, name: user.name };
        req.session.successMessage = 'Login successful!';

        // Log the session data in the console
        console.log('User session after login:', req.session);

        res.redirect('/'); // Redirect to homepage or dashboard
    } catch (error) {
        console.error("Error logging in user:", error);
        req.session.errorMessage = 'Error logging in user';
        res.redirect('/login');
    }
}

function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.redirect('/login');
    });
}




// Show projects
async function projectShow(req, res) {
    

    try {
        const user=req.session.user
        const projects = await Project.findAll();
        res.render("showproject", {projects,user});
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).send("Error fetching projects");
    }
}


// Project details
async function projectDetail(req, res) {
    const { id } = req.params;
    console.log("Fetching details for project ID:", id); // Debugging statement

    try {
        const user=req.session.user
        const project = await Project.findByPk(id);
        if (!project) {
            console.error("Project not found with ID:", id); // Debugging statement
            return res.status(404).send("Project not found");
        }
        console.log("Project details:", project); // Debugging statement
        res.render("detailProject", { project,user });
    } catch (error) {
        console.error("Error fetching project details:", error);
        res.status(500).send("Error fetching project details");
    }
}



// Delete project
async function projectDelete(req, res) {
    const { id } = req.params;
    try {
        await Project.destroy({ where: { id } });
        res.redirect("/project");
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).send("Error deleting project");
    }
}

// Edit project view
async function projectEditView(req, res) {
    const { id } = req.params;
    try {
        const project = await Project.findByPk(id);
        if (!project) {
            return res.status(404).send("Project not found");
        }
        res.render("editProject", { project });
    } catch (error) {
        console.error("Error fetching project for edit view:", error);
        res.status(500).send("Error fetching project for edit view");
    }
}

// Edit project submission
async function projectEdit(req, res) {
    const { id } = req.params;
    const { project_name, description, start_date, end_date, technologies = [], image } = req.body;

    try {
        // Update project
        await Project.update({
            project_name,
            description,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            technologies,
            image
        }, {
            where: { id }
        });

        res.redirect("/project");
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).send("Error updating project");
    }
}


// Add project
async function postProject(req, res) {
    const { project_name, start_date, end_date, description, technologies = [], image } = req.body;
    const defaultImage='https://wallpapers.com/images/hd/gojo-satoru-side-profile-3xdwa05tznpyotz9.jpg'
    try {
        await Project.create({
            project_name,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            description,
            technologies,
            image: image || defaultImage,
        });
        res.redirect("/project");
    } catch (error) {
        console.error("Error adding project:", error);
        res.status(500).send("Error adding project");
    }
}


//auth

// Other routes
function contact(req, res) {
    const user=req.session.user
    res.render("contact",{user});
}
function home(req, res) {
    const user=req.session.user
    const errorMessage = req.session.errorMessage || null;
    const successMessage = req.session.successMessage || null;

    // Clear session messages after rendering
    req.session.errorMessage = null;
    req.session.successMessage = null;
    res.render("index",{user, errorMessage, successMessage });
}
function loginView(req, res) {
    const errorMessage = req.session.errorMessage || null;
    const successMessage = req.session.successMessage || null;

    // Clear session messages after rendering
    req.session.errorMessage = null;
    req.session.successMessage = null;

    res.render("login", { errorMessage, successMessage });
}

function registerView(req, res) {
    res.render("register");
}
function testimonial(req, res) {
    const user=req.session.user

    res.render("testimonial",{user});
}

function project(req, res) {
    const user=req.session.user

    res.render("project",{user});
}

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
