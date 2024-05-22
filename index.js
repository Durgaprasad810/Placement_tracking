const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const studentRoutes = require('./routes/studentRoutes');
const Student = require('./models/studentModel')
// const { ObjectId } = require('mongoose');
const session  = require('express-session')
const companyRoutes = require('./routes/companyRoutes');
const Company = require('./models/companyModel')

const sinupRoutes = require('./routes/sinupRoutes');
const signup = require('./models/sinupModel');
const student = require('./models/studentModel');

app.use(express.urlencoded({ extened: true }))
app.use(express.json())

app.use(express.static('public'))
app.use(express.static('images'))
app.use (session({secret:' '}))



app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


mongoose.connect('mongodb://localhost:27017/Student_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


//login route

app.get('/login', (req, res) => {
  res.render('login', { errorMessage: '' })  //this rote is for when i click login on home page it will go to login page
})



app.post('/login', async (req, res) => {
  const { id, password } = req.body;         

  try {
    const user = await signup.findOne({ id: id });  
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      req.session.user_id=user._id;
      return res.render('login', { errorMessage: 'Invalid credentials. Please try again.' });
    }
    req.session.user_id=user._id;
    res.redirect(`/studentmo${id}`); 

  } catch (error) {
    console.error(error);
    res.render('login', { errorMessage: 'An error occurred. Please try again later.' });
  }
});



app.get('/admin', (req, res) => {
  res.render('admin', { errorMessage: '' })
})


app.post('/admin', async (req, res) => {
  const { id, password } = req.body;
  const ad_id = id
  // console.log(req.body)
  try {

    if (id != 'Admin') {
      return res.render('admin', { errorMessage: 'Invalid credentials. Please try again.' });
    }


    if (password != '123') { //'VjitAdmin@123'
      return res.render('admin', { errorMessage: 'Invalid credentials. Please try again.' });
    }
    req.session.user_id=id
    res.redirect(`/companymo:${ad_id}`); //change chesa big Id to id

  } catch (error) {
    console.error(error);
    res.render('admin', { errorMessage: 'An error occurred. Please try again later.' });
  }
});

app.get('/companymo:ad_id', async (req, res) => {
  const p = req.params;

  const companies = await Company.find({})
  const ad_id = p.ad_id
  // console.log(ad_id)
  const user = await signup.findOne({ Id: ad_id }).exec();

  res.render('admindisplay', { ad_id, companies });
}
)





//Company-routes


app.get('/companyDetails:ad_id', (req, res) => {
  p = req.params
  ad_id = p.ad_id
  // console.log(p)
  // console.log(ad_id)
  // res.send('Ok')
  res.render('company', { ad_id })
})


app.post('/CompanyDetails:ad_id', async (req, res) => {
  try {
    const companyData = new Company(req.body);
    await companyData.save();
    // console.log(companyData)
    res.redirect('/companymo:id')
  } catch (error) {
    res.status(500).send('Error saving data');
  }
});



app.use('/company', companyRoutes);


app.get('/admindisplayCompanydetails:id::c_id', async (req, res) => {
  const a = req.params;
  // console.log(req.params);

  const s_id = new ObjectId(a.c_id);
  const companies = await Company.find({ _id: s_id });
  const ad_id = a.id;

  res.render("adminShowCompany.ejs", { companies, ad_id });
});


// editComapny
app.get('/adminEditCompany:ad_id::com_id', async (req, res) => {
  const a = req.params
  // console.log(a)
  const c_id = a.com_id
  // console.log(c_id)
  const companies = await Company.find({ _id: a.com_id });
  // console.log(companies[0])
  company = companies[0]
  ad_id = a.ad_id

  res.render('adminEditCompany', { company, ad_id })
})




app.post('/adminEditCompany:ad_id::com_id', async (req, res) => {
  try {
    const m_id = req.params;
    const filter = { _id: m_id.com_id };
    const cid = m_id.com_id;
    const ad_id = m_id.ad_id;

    // console.log(m_id )
    // console.log(filter)
    const updateData = req.body;
    // console.log(updateData)
    const res1 = await Company.updateOne(filter, { $set: updateData });
    // console.log(res1)
    res.redirect(`/companymo${ad_id}`)
  } catch (erorr) {
    console.log(erorr)
  }

})

//applied student for that specific company
app.get('/appliedStudents:ad_id::com_id', async (req, res) => {
  p = req.params
  const company = await Company.find({ _id: p.com_id });
  let a = company[0].appliedStudents;
  let len = company[0].appliedStudents.length;
  let res1 = []
  for (let i = 0; i < len; i++) {
    const data = await Student.findOne({ id: a[i] })
    res1.push(data)
  }

  res.render("adminAppliedStudents", { res1, company: company[0], ad_id: p.ad_id });
})




app.get("/selectedStudents:ad_id::com_id::id", async (req, res) => {
    const { ad_id, com_id, id } = req.params;

    try {
        const company_id = new ObjectId(com_id);
        
        const result = await Company.updateOne(
            { _id: company_id },
            { $addToSet: { selectedStudents: id } } 
        );

        // console.log(result);

        res.redirect(`/appliedStudents${ad_id}:${com_id}`);
        // res.send('ok')
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating selectedStudents');
    }
});




app.get('/selectedStudents:ad_id::com_id', async (req, res) => {
  p = req.params
  const company = await Company.find({ _id: p.com_id });
  let a = company[0].selectedStudents;
  let len = company[0].selectedStudents.length;
  let res1 = []
  for (let i = 0; i < len; i++) {
    const data = await Student.findOne({ id: a[i] })
    res1.push(data)
  }

  res.render("adminSelectedStudents", { res1, company: company[0], ad_id: p.ad_id });
})


app.get('/deselectStudents:ad_id::com_id::id', async (req, res) => {
  const { ad_id, com_id, id } = req.params;

  try {
      const company_id = new ObjectId(com_id);
      
      const result = await Company.updateOne(
          { _id: company_id },
          { $pull: { selectedStudents: id } } 
      );

      console.log(result);

      res.redirect(`/selectedStudents${ad_id}:${com_id}`);
      // res.send('ok')
  } catch (error) {
      console.error(error);
      res.status(500).send('Error updating selectedStudents');
  }
})




//signup route

app.get('/signup', (req, res) => {
  res.render('signup', { errorMessage: '' })
})




app.post('/signupdetails', async (req, res) => {
  try {
    console.log(req.body);

    // Check if required fields are present in the request body
    if (!req.body.username || !req.body.confirmpassword) {
      return res.status(400).render('signup', { errorMessage: 'Username and Confirm Password are required' });
    }

    const user = await signup.findOne({ id: req.body.id });

    if (user) {
      return res.render('signup', { errorMessage: 'Your account already exists.' });
    } else if (req.body.password.length < 8) {
      res.render('signup', { errorMessage: 'Password must be more than 8 characters' });
    } else if (req.body.password !== req.body.confirmpassword) {
      res.render('signup', { errorMessage: 'Passwords do not match' });
    } else {
      const salt = await bcrypt.genSalt(10); 
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const newUser = new signup({
        id: req.body.id,
        username: req.body.username, 
        password: hashedPassword,
        confirmpassword: hashedPassword,

      });

      await newUser.save();
      res.status(201).render('student');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error saving data');
  }
});




app.use('/signup', sinupRoutes);


// this route is to save student data in mongoDb

app.post('/Studentdetails', async (req, res) => {   
  try {
    const studentData = new Student(req.body);
    await studentData.save();
    // console.log(studentData)
    const companies = await Company.find({})
    a = req.body
    const stu_id = a.id
    // console.log(stu_id)
    res.redirect(`/studentmo${stu_id}`)
  } catch (error) {
    console.log(error)
    res.status(500).send('Error saving data');
  }
});




//student profile route
app.get('/studentDetails', (req, res) => {
  res.render('student')
})
app.get('/studentmo:id', async (req, res) => {
  
  const a = req.params;

  const companies = await Company.find({})
  const stu_id = a.id


  res.render('displayCompany', { stu_id, companies });   
}

)




app.use('/students', studentRoutes);


// editprofile
app.get('/editprofile:stu_id', async (req, res) => {
  const a = req.params
  // console.log(a)
  const stu_id = a.stu_id
  // console.log(stu_id)
  const student = await Student.find({ id: a.stu_id })
  // const companies = await Company.find({_id:s_id});
  console.log(student[0])
  res.render('editprofile', { student: student[0], stu_id })
})




app.post('/editprofile:stu_id', async (req, res) => {
  try {
    const p = req.params;
    const filter = { id: p.stu_id };
    const sid = p.stu_id;

    // console.log(filter)
    const updateData = req.body;
    // console.log(updateData)
    const res1 = await student.updateOne(filter, { $set: updateData });
    // console.log(res1)
    res.redirect(`/studentmo${p.stu_id}`)
  } catch (erorr) {
    console.log(erorr)
  }

})



app.get('/displayCompanydetails:id::c_id', async (req, res) => {
  const a = req.params;
  const s_id = new ObjectId(a.c_id);
  const companies = await Company.find({ _id: s_id });
  const stu_id = a.id;

  res.render("showCompanydetails.ejs", { companies, stu_id });
});



// showCompanydetails
app.get('/showCompanydetails', async (req, res) => {
  const { id } = req.params;

  const companies = await Company.find({})
  res.render('showCompanydetails', { companies })
})



app.get('/applycompany:stu_id::comp_id', async (req, res) => {
  try {
  

    const comp_id = new mongoose.Types.ObjectId(req.params.comp_id);

    const company = await Company.findById(comp_id);

    const student = await Student.findOne({ id: req.params.stu_id });

    // console.log(company.maxbacklogs, student.backlogs);

    if (company.maxbacklogs >= student.backlogs) {
      if (company && company.appliedStudents && company.appliedStudents.includes(req.params.stu_id)) {
        res.send("You have already applied to this company");
      } else {
        await Student.updateOne({ id: req.params.stu_id }, { $push: { appliedCompanies: req.params.comp_id } })
        await Company.updateOne(
          { _id: comp_id },
          { $push: { appliedStudents: req.params.stu_id } }
        );
        res.send("You are eligible and your application has been submitted");
      }
    } else {
      res.send("You are not eligible to apply to this company");
    }

  } catch (error) {
    console.log(error);
    res.status(500).send('Error applying for company');
  }
});


//appliedcomapnies
app.get('/appliedcompanies:stu_id',async(req,res)=>{
  let p=req.params;
  let stu_id=p.stu_id
  let stuData =await Student.findOne({id:p.stu_id})
  // console.log(stuData)
  let a=stuData.appliedCompanies
  let comData=[]
  // console.log(a)
  let len = stuData.appliedCompanies.length
  for(let i=0;i<len;i++){
    const data = await  Company.findOne({ _id :a[i] })
    comData.push(data)
  }
  // console.log(comData)
  // res.send("ok")
  res.render("appliedCompanies",{ comData ,stu_id})
}
)



//home page of placemnt tracking

app.get('/homepage', (req, res) => {
  res.render('homepage')
})





app.get('/home', (req, res) => {
  res.send('Home page')
})

PORT = 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});