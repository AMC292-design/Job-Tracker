require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();


app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("MongoDB Connection Error: ", err));

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);


const jobApplicationSchema = new mongoose.Schema({
    name: String,
    position: String,
    status: String
});
const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);


app.get('/', (req, res) => {
    res.render('landingpage', { error: null });
    });
    
    app.get('/login', (req, res) => {
    res.render('login', { error: null });
    });


app.get('/signup', (req, res) => {
    res.render('signup', { error: null });
});


app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
       
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.render('signup', { error: "Username already exists. Try another!" });
        }

        
        const newUser = new User({ username, password });
        await newUser.save();

        console.log(`User ${username} registered successfully!`);
        res.render('login', { error: "Signup successful! Please log in." });

    } catch (error) {
        console.error("Signup Error:", error);
        res.render('signup', { error: "An error occurred. Please try again." });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });

        if (user) {
            console.log(`User ${username} logged in successfully!`);
        
            res.redirect('/t');
        } else {
            console.log(`Login failed for ${username}`);
            res.render('login', { error: "Invalid username or password" });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.render('login', { error: "An error occurred. Please try again." });
    }
});


app.get('/t', async (req, res) => {
    try {
        const applications = await JobApplication.find(); // Fetch all job applications
        res.render('JobApplication', { applications:applications });
    } catch (error) {
        console.error("Error fetching job applications:", error);
        res.status(500).send("Error loading job applications");
    }
});


app.post('/submit', async (req, res) => {
    const { id, name, position, status } = req.body;

    try {
        if (id) {
            
            await JobApplication.findByIdAndUpdate(id, { name, position, status });
            console.log(`Job application ${id} updated`);
        } else {
           
            const newApplication = new JobApplication({ name, position, status });
            await newApplication.save();
            console.log(`New job application added: ${name} - ${position}`);
        }
        res.redirect('/t');
    } catch (error) {
        console.error("Error processing job application:", error);
        res.status(500).send("An error occurred while submitting the application.");
    }
});


app.post('/delete', async (req, res) => {
    const { id } = req.body;

    try {
        await JobApplication.findByIdAndDelete(id);
        console.log(`Job application ${id} deleted`);
        res.redirect('/t');
    } catch (error) {
        console.error("Error deleting job application:", error);
        res.status(500).send("An error occurred while deleting the application.");
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
