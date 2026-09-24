#!/bin/sh
# Retarget the doc-upload prototype after transferring the GitHub repo to a new owner/org.
#
# RUN THIS ONLY AFTER:
#   1. the repo has been transferred to the new org, and
#   2. you have confirmed the new Pages URL serves (https://<new-owner>.github.io/doc-upload/), and
#   3. you have stored a path-scoped credential for the new remote (see the runbook).
#
# What it does (it does NOT commit — review, then commit in each repo yourself):
#   1. Repoints the local mirror's deploy remote (the work duplicate) to the new owner.
#   2. Rewrites the public prototype links (…github.io/doc-upload/…) in the docs and handoff repo.
#      The trailing slash after "doc-upload" means the handoff repo's own
#      "…github.io/doc-upload-handoff/" link is left untouched (that repo is not being moved).
#
# Override the owners if they differ: OLD_OWNER=kai-omf NEW_OWNER=onemain-design sh scripts/retarget-org.sh
set -u

OLD_OWNER="${OLD_OWNER:-kai-omf}"
NEW_OWNER="${NEW_OWNER:-onemain-design}"
REPO="doc-upload"

DUP="/Users/kai.jei/Documents/docs/_projects/doc-upload-work"
MAIN_DOCS="/Users/kai.jei/Documents/docs/_projects/doc-upload/docs"
HAND="/Users/kai.jei/Documents/docs/_projects/doc-upload-handoff"

echo "Retargeting $OLD_OWNER -> $NEW_OWNER for $REPO"
echo

# 1. Repoint the mirror's deploy remote (the work duplicate pushes to the transferred repo).
if [ -d "$DUP/.git" ]; then
  git -C "$DUP" remote set-url origin "https://github.com/$NEW_OWNER/$REPO.git"
  echo "mirror deploy remote -> $(git -C "$DUP" remote get-url origin)"
else
  echo "WARN: $DUP not found; skipping remote repoint"
fi
echo

# 2. Rewrite the public prototype links.
OLD="$OLD_OWNER.github.io/$REPO/"
NEW="$NEW_OWNER.github.io/$REPO/"
retarget_dir() {
  dir="$1"
  [ -d "$dir" ] || { echo "WARN: $dir not found; skipping"; return; }
  files="$(grep -rlF "$OLD" "$dir" 2>/dev/null | grep -vE '/\.git/|node_modules|/dist/')"
  [ -n "$files" ] || { echo "no matches in $dir"; return; }
  printf '%s\n' "$files" | while IFS= read -r f; do
    perl -i -pe "s#\Q$OLD\E#$NEW#g" "$f"
    echo "updated $f"
  done
}
retarget_dir "$MAIN_DOCS"
retarget_dir "$HAND"
echo
echo "Done. Review the changes, then commit in each repo (doc-upload and doc-upload-handoff)."
echo "Then run a test commit in doc-upload to confirm the mirror push + Pages deploy work end to end."
