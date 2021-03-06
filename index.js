const { prompt } = require('inquirer')
const mysql = require('mysql2')
require('console.table')

const db = mysql.createConnection('mysql://root:rootroot@localhost/employee_db')

const mainMenu = () => {
  prompt([
    {
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
        // {
        //   name: 'Update Employee Role',
        //   value: 'updateRole'
        // },
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
    }
  ])
    .then(({ choice }) => {
      switch (choice) {
        case 'viewEmployees':
          viewEmployees()
          break
        case 'addEmployee':
          addEmployee()
          break
          // case 'updateEmployeeRole':
          //   updateEmployeeRole()
          break
        case 'viewDepartments':
          viewDepartments()
          break
        case 'addDepartment':
          addDepartment()
          break
        case 'viewRoles':
          viewRoles()
          break
        case 'addRole':
          addRole()
          break
      }
    })
    .catch(err => console.log(err))
}

const viewEmployees = () => {
  db.query(`
    SELECT employee.id, employee.first_name, employee.last_name,
      role.title, role.salary, department.name AS department,
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee manager
    ON manager.id = employee.manager_id
  `, (err, employees) => {
    if (err) { console.log(err) }
    console.table(employees)
    mainMenu()
  })
}

const addEmployee = () => {
  db.query('SELECT * FROM role', (err, roles) => {
    if (err) { console.log(err) }

    roles = roles.map(role => ({
      name: role.title,
      value: role.id
    }))
    db.query('SELECT * FROM employee', (err, employees) => {
      employees = employees.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }))
      employees.unshift({
        name: 'None',
        value: null
      })

      prompt([
        {
          type: 'input',
          name: 'first_name',
          message: 'What is the first name of the employee?'
        },
        {
          type: 'input',
          name: 'last_name',
          message: 'What is the last name of the employee?'
        },
        {
          type: 'list',
          name: 'role_id',
          message: 'Choose employee role',
          choices: roles
        },
        {
          type: 'list',
          name: 'manager_id',
          message: 'Choose employee manager:',
          choices: employees
        }
      ])
        .then(employee => {
          db.query('INSERT INTO employee SET?', employee, (err) => {
            if (err) { console.log(err) }
            console.log('New Employee Added')
            mainMenu()
          })
        })
        .catch(err => console.log(err))
    })
  })
}

// const updateEmployeeRole = () => {
//   db.query('SELECT * FROM role', (err, roles) => {
//     if (err) { console.log(err) }

//     roles = roles.map(role => ({
//       name: role.title,
//       value: role.id
//     }))
//     db.query('SELECT * FROM employee', (err, employees) => {
//       if (err) { console.log(err) }

//       employees = employees.map(employee => ({
//         name: `${employee.first_name} ${employee.last_name}`,
//         value: employee.id
//       }))
//       employees.unshift({
//         name: 'None',
//         value: null
//       })
//       prompt([
//         {
//           type: 'list',
//           name: 'Update Employee Role',
//           message: `Which employee's role do you wish to update?`,
//           choices: employees
//         },
//         {
//           type: 'list',
//           name: 'role.title',
//           message: 'What new role do you want to assign to the employee?',
//           choices: roles
//         }
//           .then(employee => {
//             db.query('INSERT INTO employee SET?', employee, (err) => {
//               if (err) { console.log(err) }
//               console.log('Employee Role Updated')
//               mainMenu()
//             })
//           })
//           .catch(err => console.log(err))
//       ])
//     })
//   }


const viewDepartments = () => {
  db.query(`
    SELECT department.name AS department
    FROM department
  `, (err, departments) => {
    if (err) { console.log(err) }
    console.table(departments)
    mainMenu()
  })

}

const addDepartment = () => {
  db.query('SELECT * FROM department', (err, departments) => {
    if (err) { console.log(err) }

    departments = departments.map(department => ({
      name: department.title,
      value: department.id
    }))

    departments.unshift({ name: 'None', value: null })

    prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the department you wish to add?'
      }
    ])
      .then(department => {
        db.query('INSERT INTO department SET ?', department, (err) => {
          if (err) { console.log(err) }
          console.log('Department Created')
          mainMenu()
        })
      })
      .catch(err => console.log(err))
  })

}

const viewRoles = () => {
  db.query(`
    SELECT role.title, role.salary
    FROM role
  `, (err, roles) => {
    if (err) { console.log(err) }
    console.table(roles)
    mainMenu()
  })
}

const addRole = () => {
  db.query('SELECT * FROM role', (err, roles) => {
    if (err) { console.log(err) }

    roles = roles.map(role => ({
      name: role.title,
      value: role.id
    }))

    db.query('SELECT * FROM department', (err, departments) => {
      departments = departments.map(department => ({
        name: `${department.name}`,
        value: department.id
      }))

      roles.unshift({ name: 'None', value: null })

      prompt([
        {
          type: 'input',
          name: 'title',
          message: 'What is the role you wish to add?'
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the base salary for the role?'
        },
        {
          type: 'list',
          name: 'department_id',
          message: 'What department does the role belong to?',
          choices: departments
        }
      ])
        .then(role => {
          db.query('INSERT INTO role SET ?', role, (err => {
            if (err) { console.log(err) }
            console.log('Role Created')
            mainMenu()
          }))
        })
        .catch(err => console.log(err))
    })
  })
}

mainMenu()
