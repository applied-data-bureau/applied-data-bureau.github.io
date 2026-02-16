FROM jekyll/builder:latest

WORKDIR /srv/jekyll

COPY Gemfile Gemfile.lock* ./
RUN bundle install

EXPOSE 4000

CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--livereload", "--force_polling"]
 
# LOCAL DEVELOPMENT

# docker build -t jekyll-bureau-ru .
# docker run --rm -it -p 4006:4000 -v "$PWD:/srv/jekyll" jekyll-bureau-ru bundle exec jekyll serve --host 0.0.0.0 --livereload --force_polling --config _config.base.yml,_config.ru.yml
# docker run --rm -it -p 4007:4000 -v "$PWD:/srv/jekyll" jekyll-bureau-ru bundle exec jekyll serve --host 0.0.0.0 --livereload --force_polling --config _config.base.yml,_config.rs.yml
# docker run --rm -it -p 4008:4000 -v "$PWD:/srv/jekyll" jekyll-bureau-ru bundle exec jekyll serve --host 0.0.0.0 --livereload --force_polling --config _config.base.yml,_config.en.yml

# PRODUCTION

# деплой в githubpages
# 
# RU: https://applied-data-bureau.github.io/
#
# .github/workflows/deploy-ru.yml
#
# деплой в cf
# EN: https://applied-data-bureau.pages.dev/
# RS: https://biro-za-primenjene-podatke.pages.dev/
#
# 1. Create Project → Connect to GitHub
#    Name applied-data-bureau
# 2. Build settings
#    Build command:
#        bundle exec jekyll build --config _config.base.yml,_config.rs.yml
#        bundle exec jekyll build --config _config.base.yml,_config.en.yml
#    Build output:_site
#    Root directory:
#    Build comments:Enabled
# 3. Environment variables
#    RUBY_VERSION 3.2.2
#    JEKYLL_ENV production
