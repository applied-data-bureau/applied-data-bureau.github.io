FROM jekyll/builder:latest

WORKDIR /srv/jekyll

COPY Gemfile Gemfile.lock* ./
RUN bundle install

EXPOSE 4000

CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--livereload", "--force_polling"]

# docker build -t jekyll-bureau-ru .
# docker run --rm -it -p 4006:4000 -v "$PWD:/srv/jekyll" jekyll-bureau-ru bundle exec jekyll serve --host 0.0.0.0 --livereload --force_polling --config _config.base.yml,_config.ru.yml
