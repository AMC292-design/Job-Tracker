require ('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()



app.set("view engine","ejs")


app.use(bodyParser.urlencoded({ extended:true}))
app.use(express.static("public"))


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

        app.get("/",(req,res)=>{
            res.render("login",{error:null})
        })

        app.get("/signup",(req,res)=>{
            res.render("signup",{error:null})
        })
        // Show signup page
app.get('/signup', (req, res) => {
    res.render('signup', { error: null });
    });
    
    // Handle signup form submission
    app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    
    try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
    return res.render('signup', { error: "Username already exists. Try another!" });
    }
    
    // Save new user
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
            // Find user in the database
            const user = await User.findOne({ username, password });
            
            if (user) {
            console.log(`User ${username} logged in successfully!`);
            res.render('success', { username });
            } else {
            console.log(`Login failed for ${username}`);
            res.render('login', { error: "Invalid username or password" });
            }
            } catch (error) {
            console.error("Login Error:", error);
            res.render('login', { error: "An error occurred. Please try again." });
            }
            });
        const PORT = process.env.PORT || 3000;
            app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
