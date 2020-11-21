# Creation of branches

## Naming syntaxes **FOLLOW PLEASE**

###### newFeature-FeatureName

###### FIXME-IssueName

**DO NOT CREATE BRANCHES AFTER YOUR NAME BECAUSE IT MAKES NO SENSE**

**DO NOT DO MULTIPLE TASKS IN ONE BRANCH, BREAK IT DOWN TO PER FEATURE**

# RULES

- If you are unsure of what you are commiting, pushing please **ASK** before doing so.
- **DO NOT** leave your code uncommited over the night even if incompleted. Just continue the next day.
- THIS IS NOT A PLAYGROUND REPO SO **DO NOT** push anything funny.

## CHEERS! ALL THE BEST FOR FYP

# Instructions to running the project:

- Be sure to download nodejs in your machine first (Run node -v in your terminal to check)
- Clone the project.
- In the terminal, run npm install to install the node packages.
- In the terminal, run "npm run dev"
  Backend will be on http://localhost:9000
  Client will be on http://localhost:3000
  
# Git commands:
### BASICS
Cloning this repo to your computer:
* git clone https://github.com/WeiXian042901/fyp_repository.git

Pulling new changes (Make sure you are on the correct branch):

* git pull

Pushing new changes:

* git add .
* git commit -m "\<your message here>"
* git push

Switching to another branch:

* git checkout \<branch name>

**If you want to work on a new feature (IMPORTANT):**

* git checkout -b \<Name of feature>
* git add .
* git commit -m "\<your message here>"
* git push
* git push -u origin \<Name of feature>

Updating your local list of branches based on the remote repo:

* git fetch

Viewing your local list of branches (Both local and remote):

* git branch -a

If you want to check whether your current branch is up-to-date or not:
* git status

### INTERMEDIATE
If you are coding on a branch halfway but need to switch to another branch for some reason:<br />
(You can also do this if you are coding halfway and want to reference the original version of the current branch)
* git stash
* git stash pop (to reverse)

If you accidentally committed some changes and want to wipe them out completely:

* git reset --hard

If there is a merging conflict and I am not around to resolve it (This should not happen ideally):

* git merge \<branch name TO BE MERGED INTO MAIN> **(MAKE SURE YOU ARE ON THE MAIN BRANCH)**

If you see a funny-looking blue text screen and don't know what to do, refer to this: https://stackoverflow.com/questions/19085807/please-enter-a-commit-message-to-explain-why-this-merge-is-necessary-especially

Merging automatically does the add and commit commands for you, so simply run a git push to commit those changes into the remote repo.

### ADVANCED
When you push code to GitHub, Git sometimes adds line-breaks to your code depending on your autocrlf setting. This can be very ugly and mess up formatting for others who pull your code, so let's standardize everyone's settings to FALSE by default.

Setting line-endings in git to false by default:
* Check your autocrlf status here: https://stackoverflow.com/questions/1475199/how-can-i-print-out-the-value-of-a-git-configuration-setting-core-autocrlf-on
(If it says false or doesn't display anything, it is already set to false and you don't have to do anything)
* Change your autocrlf status here: https://stackoverflow.com/questions/10418975/how-to-change-line-ending-settings
* More info: https://stackoverflow.com/questions/2825428/why-should-i-use-core-autocrlf-true-in-git

### OTHERS

(I haven't used these commands much but they exist)
- git rebase
- git cherry-pick

**Merging of branches will only be done by Gabriel. He is the main IC for this.**

# TROUBLESHOOTING

* Why I got error when running npm run dev?

Make sure you have nodejs installed. Then run npm install in your local directory to import all the node_module dependencies.

If you still have error it means that one or more modules were not installed. Check the logs and run npm install \<name of module> to install it. Do this for each module.

For me I had to install react, react-scripts, react-dom and semantic-ui-css separately.

If you still have errors, PM either me or Wei Xian.

* I cannot run the npm run dev command after the first time, help!

It is possible that you have forgotten to terminate the first npm run dev process, so ports 3000 and 9000 are still being occupied.
Run this command to kill all node processes: ```taskkill /F /IM node.exe```

* I keep getting ECONNREFUSED errors when I try to run the server, help!

We have set up a MySQL Database on our side already. You have to install MySQL (including the Server and Connector add-ons), and then you should see a new default connection already created for you in the MySQL Workbench (It was MySQL80 for me). 

After this you have to create a new schema called 'financial_literacy' as provided in the db.js file.

Run this command in MySQL: ```CREATE SCHEMA 'financial_literacy'```

After that remember to **TURN YOUR SQL SERVER ON** before running npm run dev or related commands.

If you have done everything correctly, you should get two messages - '**Connection successful!**' and '**Compiled succesfully**' in your log which indicate your app and server are running successfully on ports 3000 and 9000 respectively. 
