# Truepill - Reece Ward

## Setup

This application was written in Javascript and tested using [Node.js](https://nodejs.org/en/) environment.

To install the required modules open a command prompt in the target folder and enter the following command.
```
npm install
```
Once this has finished you can run the application with: 
```
npm start
```
## Description

This section will cover the features and my decisions behind the application. When the application starts a menu is displayed in the console with 9 possible options.

Formulary and Inventory data for the application are stored in local JSON files with some checks in place to avoid duplicate data being stored.

The first 3 menu options are based on the first scenario where a pharmacist needs to define a list of medications that it will stock. The application will then add the medication to the Formulary or display an error message if the medication already exists.
```
[1] Add Paracetamol and Ibuprofen to formulary
[2] Add Amoxicillin to formulary
[3] Add Codeine, Diclofenac, Simvastatin, Tramadol to formulary
```

The fourth option expands on this by allowing a custom medication name to be entered instead of the predefined medication from the scenario.
```
[4] Add custom medication to formulary
```

The final requirement for the first scenario was to display a list of all medications in the formulary.
```
[5] List the names of the Medications in the formulary
```

The next scenario described an Inventory system used to maintain stock levels of each medication. The 6th menu option will attempt to add the seven given medications to the inventory list.

The application will perform two checks before adding a medication to the inventory. The first
will check if the medication exists in the formulary and will provide an error if not. The second will search for a duplicate entry of the same Name, Strength, and Pack Size and will then add quantity to the existing entry instead of creating a new one if necessary.
```
[6] Add sample stock list
```

The next option is similar to [4] which allows a custom stock entry to be added to the inventory instead of the examples listed in the scenario.
```
[7] Add custom stock entry
```

The eighth option will list the medication and quantities of the current inventory in a table format.
```
[8] List medication in stock
```

The final option will exit the application. I would have liked to implement more features and validation however this would have taken me outside of the suggested 4-6 hour period.
