FROM	 archlinux:latest

ENV USER="igor"
ENV PROJ="/home/$USER/scraper_etsy"
MAINTAINER $USER

# Install pkgs
RUN	pacman -Syy --noconfirm --needed zsh zsh-completions openssh docker-compose git pkgfile zsh-syntax-highlighting python-virtualenvwrapper base-devel jq go
RUN exec $SHELL -l

RUN mkdir /var/run/sshd

RUN sed -i "/# %wheel ALL=(ALL) ALL/s/^#//" /etc/sudoers
RUN sed -i "/# %wheel ALL=(ALL) NOPASSWD: ALL/s/^#//" /etc/sudoers

RUN useradd -G wheel -ms /bin/zsh $USER && \
    mkdir /home/$USER/.ssh && \
    chmod 700 /home/$USER/.ssh
COPY id_rsa.pub /home/$USER/.ssh/authorized_keys
RUN /usr/bin/ssh-keygen -A
RUN chown $USER:$USER -R /home/$USER/.ssh && \
    chmod 600 /home/$USER/.ssh/authorized_keys

USER $USER
WORKDIR /home/$USER/
RUN git clone https://aur.archlinux.org/yay.git && \
    cd yay && \
    makepkg -sri --needed --noconfirm && \
    cd .. && \
    rm -rf yay
RUN yay -S --needed --noconfirm nerd-fonts-source-code-pro
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
COPY .zshrc /home/$USER/
COPY .p10k.zsh /home/$USER/
RUN git clone --depth=1 https://github.com/romkatv/powerlevel10k.git /home/$USER/.oh-my-zsh/themes/powerlevel10k
RUN git clone https://github.com/zsh-users/zsh-autosuggestions ~/.zsh/zsh-autosuggestions
RUN git clone --single-branch --branch dev https://github.com/spiritEcosse/scraper_etsy.git
USER root
RUN unset USER
WORKDIR /home/$USER/scraper_etsy

# Set correct locale
RUN echo "LC_ALL=en_US.UTF-8" >> /etc/environment && \
    echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen && \
    echo "LANG=en_US.UTF-8" > /etc/locale.conf
RUN locale-gen en_US.UTF-8
ENV LC_CTYPE 'en_US.UTF-8'

RUN rm -rf /run/nologin
# Run openssh daemon
CMD	 ["/usr/sbin/sshd", "-D"]
#ENTRYPOINT ["run.sh"]
