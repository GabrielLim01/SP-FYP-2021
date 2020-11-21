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

Changing a branch:

* git checkout \<branch name>

Check status of ALL branches (local and remote):

* git branch -a

**If you want to work on a new feature (IMPORTANT):**

* git checkout -b \<Name of feature>
* git add .
* git commit -m "\<your message here>"
* git push
* git push -u origin \<Name of feature>

If you want to check whether your current branch is up-to-date or not:
* git status

### INTERMEDIATE
If you are coding on a branch halfway but need to switch to another branch for some reason:
(You can also do this if you are coding halfway and want to reference the original version of the current branch)
* git stash
* git stash pop (to reverse)

If you accidentally committed some changes and want to wipe them out completely:

* git reset --hard

If there is a merging conflict and I am not around to resolve it (This should not happen ideally):

* git merge

If you see a funny-looking blue text screen and don't know what to do, refer to this: https://stackoverflow.com/questions/19085807/please-enter-a-commit-message-to-explain-why-this-merge-is-necessary-especially

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

If you still have error it means that one or more modules were not installed. Check the logs and run npm install <name of module> to install it.

If you still have errors, PM either me or Wei Xian.

* I cannot run the npm run dev command after the first time, help!

It is possible that you have forgotten to terminate the first npm run dev process, so ports 3000 and 9000 are still being occupied.
Follow the instructions here: https://medium.com/fredwong-it/how-to-kill-the-process-on-localhost-3000-port-on-window-7e788cd335e8

* I have this error screen for sass loader, what is it?

Read this and follow the instructions on the page: https://stackoverflow.com/questions/64625050/error-node-sass-version-5-0-0-is-incompatible-with-4-0-0
Feature is still in development so there might be more changes.
