#!/bin/bash
set -e

APP_NAME=$(basename "${PWD}")

source "${HOME}/Websites/infrastructure/deploy/config.sh"
source "${HOME}/Websites/infrastructure/deploy/composer.sh"
source "${HOME}/Websites/infrastructure/deploy/etc.sh"
source "${HOME}/Websites/infrastructure/deploy/git.sh"
source "${HOME}/Websites/infrastructure/deploy/static.sh"

check_git_branch
build_static
check_git_changes
deploy_git
deploy_env "demo/.env.example" "demo/.env"
deploy_env "demo/public/.htaccess.example" "demo/public/.htaccess"
deploy_composer "/demo"
link_csp "/demo/public"
