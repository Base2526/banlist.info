FROM drupal:9.0

# WORKDIR /var/www/html

# install certbot
RUN apt-get update && \
    apt-get install nano -y && \
    apt-get install certbot -y && \
    openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048

USER root

RUN a2enmod ssl

RUN mkdir web/sites/default/modules && \
    chmod 777 web/sites/default/modules

RUN mkdir web/sites/default/files && \
    chmod 777 web/sites/default/files

RUN mkdir  -p .well-known/acme-challenge && \
    chmod 777 .well-known/acme-challenge

COPY modules web/sites/default/modules

COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

EXPOSE 80 443