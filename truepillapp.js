let fs = require('file-system');
let readlineSync = require('readline-sync');

function run() {
	console.clear();
	while (true) {
		console.log("---------------------------------------------");
		console.log("Menu: ")
		
		validOptions = ['Add Paracetamol and Ibuprofen to formulary', 'Add Amoxicillin to formulary', 'Add Codeine, Diclofenac, Simvastatin, Tramadol to formulary', 'Add custom medication to formulary', 'List the names of the Medications in the formulary', 'Add sample stock list', 'Add custom stock entry', 'List medication in stock', 'Exit'],
		answer = readlineSync.keyInSelect(validOptions, 'Enter option: ', {cancel: false});
		console.clear();
		console.log('\x1b[1m%s\x1b[0m', validOptions[answer]);  
		
		switch (answer+1) {
		  case 1: // 1.1 Scenario 1
			add_Medication("Paracetamol");
			add_Medication("Ibuprofen");
			break;
		  case 2: // 1.1 Scenario 2
			add_Medication("Amoxicillin");
			break;
		  case 3: // 1.1 Scenario 3
			add_Medication("Codeine");
			add_Medication("Diclofenac");
			add_Medication("Simvastatin");
			add_Medication("Tramadol");
			break;
		  case 4: // Add custom medication to formulary
			let formularyName = readlineSync.question("Enter the name of medication to be added to the formulary: ");
			add_Medication(formularyName);
			break;
		  case 5: // 1.1 Scenario 4
			list_Medication(); 
			break;
		  case 6: // 1.2 Scenario 1
			add_Inventory("Paracetamol", "500mg", 50, 100);
			add_Inventory("Ibuprofen", "500mg", 50, 100);
			add_Inventory("Amoxicillin", "250mg", 20, 20);
			add_Inventory("Tramadol", "50mg", 100, 5);
			add_Inventory("Codeine", "30mg", 10, 20);
			add_Inventory("Simvastatin", "10mg", 10, 10);
			add_Inventory("Warfarin", "3mg", 50, 5);
			break;
		  case 7: // Add custom medication to inventory
			let medicationName = readlineSync.question("Enter the name of medication to be added to the inventory: ");
			let medicationStrength = readlineSync.question("Enter the strength of medication (in mg): ");
			let medicationSize = readlineSync.question("Enter the size of each medication (tablets per pack): ");
			let medicationQuantity = readlineSync.question("Enter the quantity of medication to be added to the stock: ");
			add_Inventory(medicationName,medicationStrength+"mg",parseInt(medicationSize),parseInt(medicationQuantity));
			break;
		  case 8: // 1.2 Scenario 2
			list_Inventory(); 
			break;
		  case 9: // Exit
			process.exit();
		}
	}
}

function sortValue(value) {    
    return function(a, b) {    
        if (a[value] > b[value]) {    
            return 1;    
        } else if (a[value] < b[value]) {    
            return -1;    
        }    
        return 0;    
    }    
} 

//Formulary functions
function add_Medication(med_name) { // Adds a medication name to the Formulary, with checks to make sure each entry is unique
	let Formulary = load_Medication();
	
	let exists = search_Medication(med_name);
	if (exists.length == 0) { // Item does not already exist in formulary
		console.log('\x1b[42m%s\x1b[0m', "!", "Adding " , med_name, " to the formulary");  
		Formulary.medication.push(med_name);	
		Formulary.medication.sort();	
		fs.writeFileSync("./formulary.json", JSON.stringify(Formulary, null, 2));
	} else { // Item already exists in formulary
		console.log('\x1b[41m%s\x1b[0m', "X", med_name, "already exists in the formulary");  
	}
}

function load_Medication() { // Retrieve and return current medication list from JSON file
	let Formulary = require("./formulary.json"); 
	return Formulary;
}

function search_Medication(med_name) {
	let Formulary = load_Medication();
	return Formulary.medication.filter(item => item == med_name);
}

function list_Medication() { // Outputs a list of medication names to the console 
	let Formulary = load_Medication();
	console.log('\x1b[36m%s\x1b[0m', "Formulary Medication List");  
	for (x = 0; x < Formulary.medication.length; x++) { console.log(x+1 + ": " + Formulary.medication[x]); };
}

//Inventory functions
function add_Inventory(med_name, med_strength, med_pack_size, med_total_packs) { // 
	let Stock = load_Inventory();
	let Formulary = load_Medication();
	
	let formulary_check = search_Medication(med_name); //1. Check if medication is stored in formulary
	let dMed = search_Inventory(med_name); //2. Check if duplicate entry
	let duplicate_check = false;
	
	for (d = 0; d < dMed.length; d++) {
		if (med_strength == dMed[d].Strength && med_pack_size == dMed[d].Pack_Size) {
			duplicate_check = true;
			break;
		}
	}
	
	if (duplicate_check == true) { // Duplicate entry already exists in inventory
		let oldQuantity = dMed[d].Quantity;
		let index = Stock.inventory.indexOf(dMed[d]);
		Stock.inventory.splice(index, 1);
		
		console.log('\x1b[43m%s\x1b[0m', "!", "Duplicate entry : " + med_name, med_strength + " * " + med_pack_size + " tablets. Adding " + med_total_packs + " quantity to existing inventory entry");  
		medication = {"Name": med_name, "Strength": med_strength, "Pack_Size": med_pack_size, "Quantity": med_total_packs+oldQuantity };
		
		Stock.inventory.push(medication);
		Stock.inventory.sort(sortValue("Name"));
		fs.writeFileSync("./inventory.json", JSON.stringify(Stock, null, 2));
	} else if (formulary_check.length > 0) { // Item exists in formulary
		console.log('\x1b[42m%s\x1b[0m', "!", "Adding " + med_total_packs + " packs of " + med_name, med_strength + " x " + med_pack_size + " tablets to the inventory");  
		medication = {"Name": med_name, "Strength": med_strength, "Pack_Size": med_pack_size, "Quantity": med_total_packs };
		
		Stock.inventory.push(medication);
		Stock.inventory.sort(sortValue("Name"));
		fs.writeFileSync("./inventory.json", JSON.stringify(Stock, null, 2));
	} else { // Item does not exist in formulary
		console.log('\x1b[41m%s\x1b[0m', "X", med_name, "doesn't exist in formulary and cannot be added to inventory"); 
	}
}

function load_Inventory() {
	let Stock = require("./inventory.json"); 
	return Stock;
}

function search_Inventory(med_name) {
	let Stock = load_Inventory();
	return Stock.inventory.filter(item => item.Name == med_name);
}

function list_Inventory() {
	let Stock = load_Inventory();	
	console.log('\x1b[36m%s\x1b[0m', "Inventory Medication List");  
	
	let table = [];
	for (a = 0; a < Stock.inventory.length; a++) { table.push(Stock.inventory[a]); }
	console.table(table);
}

//-----
run();
