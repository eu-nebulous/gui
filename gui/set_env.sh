#!/bin/sh

ROOT_DIR=/usr/share/nginx/html

# Replace env vars in files served by NGINX
for file in $ROOT_DIR/assets/*.js* $ROOT_DIR/index.html;
do
  echo "Setting VITE_API_URL_PLACEHOlDER environment variables ${VITE_API_URL}"
  sed -i 's|VITE_API_URL_PLACEHOLDER|'${VITE_API_URL}'|g' $file

  echo "Setting VITE_CFSB_API_URL_PLACEHOLDER environment variables ${VITE_CFSB_API_URL}"
  sed -i 's|VITE_CFSB_API_URL_PLACEHOLDER|'${VITE_CFSB_API_URL}'|g' $file

  echo "Setting VITE_CONTEXT_PLACEHOLDER environment variables ${VITE_CONTEXT}"
  sed -i 's|VITE_CONTEXT_PLACEHOLDER|'${VITE_CONTEXT}'|g' $file

done


exec "$@"