FROM drupal:9.0

# WORKDIR /var/www/html

USER root

RUN mkdir web/sites/default/modules && \
    chmod 777 web/sites/default/modules

COPY modules web/sites/default/modules

EXPOSE 80