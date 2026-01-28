FROM jekyll/builder:latest

WORKDIR /srv/jekyll

COPY Gemfile Gemfile.lock* ./
RUN bundle install

EXPOSE 4000

CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--livereload", "--force_polling"]

# docker build -t jekyll-bureau-ru .
# docker run --rm -it -p 4006:4000 -v "$PWD:/srv/jekyll" jekyll-bureau-ru



#FROM jekyll/builder:latest

#WORKDIR /srv/jekyll

#COPY Gemfile ./
#RUN bundle install

#EXPOSE 4000

#CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--livereload"]

#CMD ["jekyll", "serve", "--host", "0.0.0.0", "--livereload", "--port", "4000"]

# docker build --no-cache -t jekyll-bureau-ru .
# docker build -t jekyll-bureau-ru .

# docker run --rm -it -p 4006:4000 -v "$PWD:/srv/jekyll" jekyll-bureau-ru
  






# docker build -t jekyll-bureau-ru .

# docker run --rm -it -p 4006:4000 -v "$PWD/docs:/srv/jekyll" jekyll-bureau-ru jekyll serve --host 0.0.0.0 --destination /tmp/_site


#docker run --rm -it \
#  -p 4006:4000 \
#  -v "$PWD/docs:/srv/jekyll" \
#  jekyll-local \
#  jekyll serve --host 0.0.0.0 --destination /tmp/_site
