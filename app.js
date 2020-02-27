const prompt = require('inquirer').createPromptModule()
const Employee = require('./lib/Employee')
const Engineer = require('./lib/Engineer')
const Intern = require('./lib/Intern')
const Manager = require('./lib/Manager')
const fs = require('fs')
const Handlebars = require('handlebars')
let teamMembersArr = []
let HTML = ''

// app.engine('.hbs', require('express-handlebars')({ extname: '.hbs' }))
// app.use(express.static(join(__dirname, 'public')))
// app.set('view engine', '.hbs')


let teamNumQues = [
  'Add total number of employees?'
]

let managerQuestions = [
  "Please enter the Manager's full name?",
  "What is the Manager's phone number?"
]

let engineerQuestions = [
  "What is the Engineer's gitHub?"
]

let internQuestions = [
  "What School do you currently attend?"
]

let questions = [
  "What is employee name?",
  "What is employee id?",
  "What is employee email?",
  "What is employee position?"
]

async function startQuestions() {
  const initPrompt = await prompt([{
    type: 'input',
    name: 'teamNumber',
    message: teamNumQues[0]
  },
  {
    type: 'input',
    name: 'managerName',
    message: managerQuestions[0]
  },
  {
    type: 'input',
    name: 'managerOffice',
    message: managerQuestions[1]
  },
  {
    type: 'input',
    name: 'managerId',
    message: questions[1]
  },
  {
    type: 'input',
    name: 'managerEmail',
    message: questions[2]
  }
  ])
    .then(({ teamNumber, managerName, managerOffice, managerId, managerEmail }) => {
      teamNumber = teamNumber
      let lead = new Manager(managerName, managerId, managerEmail, managerOffice)
      teamMembersArr.push(lead)
      askTeamMembers(teamNumber - 1)


    })
    .catch(e => console.error(e))
}

async function askTeamMembers(teamNumber) {
  for (let i = 0; i < teamNumber; i++) {
    let currentRole
    let currentName

    const internEngineer = await prompt([{
      type: 'input',
      name: `memberName`,
      message: questions[0]
    },
    {
      type: 'list',
      name: `memberRole`,
      message: questions[3],
      choices: ["Engineer", "Intern"]
    }])
      .then(({ memberName, memberRole }) => {
        currentName = memberName
        currentRole = memberRole
      })

    if (currentRole === 'Engineer') {
      const engineerPrompt = await prompt([{
        type: 'input',
        name: `memberId`,
        message: questions[1]
      }, {
        type: 'input',
        name: `memberEmail`,
        message: questions[2]
      },
      {
        type: 'input',
        name: `memberGithub`,
        message: engineerQuestions[0]
      }
      ]).then(({ memberId, memberEmail, memberGithub }) => {
        let engineerMember = new Engineer(currentName, memberId, memberEmail, memberGithub)
        teamMembersArr.push(engineerMember)
      }
      )
    }
    else {
      const internPrompt = await prompt([{
        type: 'input',
        name: `memberId`,
        message: questions[1]
      }, {
        type: 'input',
        name: `memberEmail`,
        message: questions[2]
      },
      {
        type: 'input',
        name: `memberSchool`,
        message: internQuestions[0]
      }
      ]).then(({ memberId, memberEmail, memberSchool }) => {

        let internMember = new Intern(currentName, memberId,
          memberEmail, memberSchool)

        teamMembersArr.push(internMember)
      }
      )

    }
  }


  let htmlData = ''

  teamMembersArr.forEach((elem, i) => {
    if (elem instanceof Manager) {
      let managerSrc = readTemplateFile('./templates/manager.html')
      let managerTemplate = Handlebars.compile(managerSrc)
      let resultManager = managerTemplate(elem);
      htmlData += resultManager
    }
    else if (elem instanceof Intern) {
      let InternSrc = readTemplateFile('./templates/intern.html')
      let InternTemplate = Handlebars.compile(InternSrc)
      let resultIntern = InternTemplate(elem);
      htmlData += resultIntern
    }
    else {
      let EngineerSrc = readTemplateFile('./templates/engineer.html')
      let EngineerTemplate = Handlebars.compile(EngineerSrc);
      let resultEngineer = EngineerTemplate(elem);
      htmlData += resultEngineer

    }

  })

  let mainSrc = readTemplateFile('./templates/main.html')
  let mainTemplate = Handlebars.compile(mainSrc);
  let data = { data: htmlData }
  let resultMain = mainTemplate(data);

  writeToFile('./output/team.html', resultMain)
}

const readTemplateFile = (fileName) => {
  return fs.readFileSync(fileName, 'utf8');
}

const writeToFile = (fileName, data) => {
  fs.writeFile(fileName, data, (err) => {
    if (err) throw err;
    console.log('Saved!');
  });
}

startQuestions()