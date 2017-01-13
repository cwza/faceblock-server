FROM ubuntu:16.04
COPY install.sh /
COPY execute.sh /
RUN chmod +x /install.sh
RUN chmod +x /execute.sh
RUN bash /install.sh
ENTRYPOINT ["/execute.sh"]
