import inquirer from "inquirer";
import { faker } from "@faker-js/faker";
import chalk from "chalk";

class Customer {
    firstName: string;
    lastName: string;
    age: number;
    gender:string;
    cellNumber: number;
    accNumber: number;
    
    constructor(
        fName:string, 
        lName:string, 
        age:number, 
        gender:string, 
        cell:number, 
        acc:number) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.cellNumber = cell;
        this.accNumber = acc;

    }
}
    interface BankAccount {
        accNumber: number,
        balance: number,


    }
class Bank{
    customer: Customer[] =[];
    account: BankAccount[] = [];

    addCustomer(obj:Customer){
        this.customer.push(obj);

    }
    addAccountNumber(obj:BankAccount){
        this.account.push(obj);
    }
    transation(accobj:BankAccount){
let NewAccounts = this.account.filter((acc) => acc.accNumber !== accobj.accNumber);
this.account = [...NewAccounts, accobj];
    }
}

let myBank = new Bank();

for(let i:number = 1; i <= 20; i++){
    let fName = faker.person.firstName();
    faker.person.firstName('female'); 
    faker.person.firstName('male');
    let lName = faker.person.lastName('male');
    let num = parseInt(faker.phone.number());
    const cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({accNumber: cus.accNumber,balance:1000*i});

}
async function bankService(bank:Bank) {
    do{
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Please Select the Service",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit"]
        });
        if (service.select == "View Balance"){
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter Account Number:",
            });
        let account = myBank.account.find((acc)=>acc.accNumber == res.num)
        if (!account){
            console.log(chalk.bgRed.bold.italic("Invalid Account Number"));
        }
            if (account){
                let name = myBank.customer.find((item)=>item.accNumber == account?.accNumber);
                console.log(`Dear ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)} your account balance is ${chalk.blueBright("$", account.balance)}`)
            }
        }
        if (service.select == "Cash Withdraw"){
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter Account Number:",
            });
        let account = myBank.account.find((acc)=>acc.accNumber == res.num)
        if (!account){
            console.log(chalk.bgRed.bold.italic("Invalid Account Number"));
        }
            if (account){
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please Enter your amount:",
                    name: "rupee",
                });
                if (ans.rupee > account.balance){
                    console.log(chalk.redBright.bold.italic("Insufficent Balance"));
                }
                let newBalance = account.balance - ans.rupee
                //transation method
                bank.transation({accNumber:account.accNumber,balance:newBalance});
                
            }
        }
        if (service.select == "Cash Deposit"){
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter Account Number:",
            });
        let account = myBank.account.find((acc)=>acc.accNumber == res.num)
        if (!account){
            console.log(chalk.bgRed.bold.italic("Invalid Account Number"));
        }
            if (account){
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please Enter your amount:",
                    name: "rupee",
                });
                let newBalance = account.balance + ans.rupee
                //transation method
                bank.transation({accNumber:account.accNumber,balance:newBalance});
            }
        }}
    while(true)
}

bankService(myBank);