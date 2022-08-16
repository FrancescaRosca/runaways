# runaways
An App to help queer people who needs to run away from their homes and find shelter somewhere else.

# First installation

- Run `yarn install` on main folder
- Go to the client folder and run `yarn install` again
- In your main directory, create an .env file with the following code:
  - `DB_HOST=localhost`
  - `DB_USER=root`
  - `DB_NAME=runaways`
  - `DB_PASS=your_pass`
  - `SUPER_SECRET=your_secret`  
  - Change your_pass to your password
  - Change your_secret to anything you want, this word/sentence will be used to encrypt our data later
- On another terminal, run mysql -u root -p
  - If you already created a database called "runaways", plis delete it so it can be created again with the updated fields and mockup information. In mysql, write `DROP DATABASE runaways;` Then, write again `CREATE DATABASE runaways;`.
  - A new database will be created in your local mysql.
## - Go to your terminal, in the main directory and type `yarn migrate`, all the tables will be created.
- Now you should be able to run `yarn start` in both folders without issue.

