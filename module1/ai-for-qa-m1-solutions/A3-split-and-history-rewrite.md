# A3: move the solutions out and remove them from history

**Why this has to be run from your computer:** this Claude session can read `nebius-academy-templates/ai-web-qa-course`, but GitHub refuses its pushes. It also has no terminal on your computer. Your own GitHub account has push access but not admin.

**Current state (checked 2026-11-01):**
- The repo is **public** and has **1 fork**.
- `module1/ai-for-qa-m1-solutions` is in two commits:
  - `7280ba7 module 1`, which is on `main`, `Module1`, `module4`, `fix/bug-reset-test-reseed` and `shakib_Module1`
  - `d3721a7 module 1 fixes`, on `shakib_Module1` only
- So the answer keys are already public on `main`.

**What a rewrite cannot undo:**
- Anyone who has cloned the repo, and the existing fork, keeps the old commits.
- GitHub keeps pull-request refs and cached commit views until GitHub Support purges them.

Ask whoever owns the org before starting. Step 3 rewrites `main` on a shared org repo, and branch protection may need lifting by an admin.

Commands are for PowerShell on Windows. Run them from `C:\Users\shaki\Documents\Repos`.

## Step 0. Save the solutions outside the repo

```powershell
robocopy ai-web-qa-course\module1\ai-for-qa-m1-solutions ai-for-qa-m1-solutions /E
```

This copies everything, including the gitignored `run-checks` folder.

## Step 1. Finish the learner branch: C1 clean-up, untrack solutions, commit, push

```powershell
cd ai-web-qa-course

# C1: the renamed folders already exist; remove the old copies
git rm -r module1/ai-for-qa-m1/data/flaky-test-prompt module1/ai-for-qa-m1/data/data-classification module1/ai-for-qa-m1/data/token-cost-estimate

# Any hits here are references still using the old folder names: fix them before committing
git grep -n -e flaky-test-prompt -e data-classification -e token-cost-estimate

# Stop tracking the solutions and keep them out from now on
git rm -r --cached module1/ai-for-qa-m1-solutions
Add-Content .gitignore "`nmodule1/ai-for-qa-m1-solutions/"

git add -A
git commit -m "Module 1: real claude.ai captures, SME rulings, folder renames; remove solutions from learner repo"
git push origin shakib_Module1
cd ..
```

## Step 2. Create the private solutions repo

You need permission to create repositories in the org. If you don't have it, ask an org admin to create an empty private repo with this name.

```powershell
cd ai-for-qa-m1-solutions
git init -b main
git add -A
git commit -m "Module 1 solutions and grader run checks"
gh repo create nebius-academy-templates/ai-for-qa-m1-solutions --private --source . --push
cd ..
```

## Step 3. Rewrite history on the public repo

Do this only after Step 1 is merged wherever it needs to go, because the rewrite changes every commit ID.

```powershell
pip install git-filter-repo
git clone --mirror https://github.com/nebius-academy-templates/ai-web-qa-course.git ai-web-qa-course-mirror
cd ai-web-qa-course-mirror
git filter-repo --path module1/ai-for-qa-m1-solutions --invert-paths

# filter-repo removes the remote on purpose; add it back
git remote add origin https://github.com/nebius-academy-templates/ai-web-qa-course.git

# Push branches and tags only (GitHub rejects pushes to refs/pull/*)
git push --force --all origin
git push --force --tags origin
cd ..
```

If the push to `main` is rejected as a protected branch, an org admin has to allow force pushes for the duration, then turn protection back on.

## Step 4. After the rewrite

1. **Check it worked.** On a fresh clone, this must print nothing:
   ```powershell
   git clone https://github.com/nebius-academy-templates/ai-web-qa-course.git check
   cd check
   git log --all --oneline -- module1/ai-for-qa-m1-solutions
   ```
2. **Re-clone.** Everyone with a clone must re-clone. Old clones still hold the solutions and would push them back. Rename your old folder (for example to `ai-web-qa-course-old`), clone fresh, then delete the old one once you're sure nothing is missing.
3. **The fork.** Ask its owner to delete it and fork again, or ask GitHub Support to handle it.
4. **Cached data.** Contact GitHub Support to purge cached views and pull-request refs that still point at `7280ba7` and `d3721a7`.

**Done when:** the check in point 1 prints nothing, and the fork has been dealt with.
