const { prompt } = require('inquirer')

const mainMenu = () => {
  prompt([
    type: 'list',
    name: 'choice',
    message: 'Choose an action',
    choices: [
      {
        name: 'View Employees',
        value: 'viewEmployees'
      },
      {
        name: 'Add Employee',
        value: 'addEmployee'
      },
      {
        name: 'Update Employee Role',
        value: 'updateRole'
      },
      {
        name: 'View Departments',
        value: 'viewDepartments'
      },
      {
        name: 'Add Department',
        value: 'addDepartment'
      },
      {
        name: 'View Roles',
        value: 'viewRoles'
      },
      {
        name: 'Add Role',
        value: 'addRole'
      },
    ]
  ])
    .then(res => {
      console.log(res)
    })
    .catch(err => console.log(err))
}

mainMenu()