FROM	 archlinux:latest

ENV USER="igor"
ENV HOME_USER="/home/$USER"
ENV PROJ="$HOME_USER/scraper_etsy"
MAINTAINER $USER

# Install pkgs
RUN	pacman -Syy --noconfirm --needed zsh zsh-completions openssh docker-compose git pkgfile zsh-syntax-highlighting python-virtualenvwrapper base-devel jq go
RUN exec $SHELL -l

RUN mkdir /var/run/sshd

RUN sed -i "/# %wheel ALL=(ALL) ALL/s/^#//" /etc/sudoers
RUN sed -i "/# %wheel ALL=(ALL) NOPASSWD: ALL/s/^#//" /etc/sudoers

RUN useradd -G wheel -ms /bin/zsh $USER && \
    mkdir $HOME_USER/.ssh && \
    chmod 700 $HOME_USER/.ssh
COPY id_rsa.pub $HOME_USER/.ssh/authorized_keys
RUN /usr/bin/ssh-keygen -A
RUN chown $USER:$USER -R $HOME_USER/.ssh && \
    chmod 600 $HOME_USER/.ssh/authorized_keys

USER $USER
RUN cd $HOME_USER/ &&\
    git clone https://aur.archlinux.org/yay.git && \
    cd yay && \
    makepkg -sri --needed --noconfirm && \
    cd .. && \
    rm -rf yay
RUN yay -Sy --needed --noconfirm nerd-fonts-source-code-pro
RUN yay -Sy --needed --noconfirm micro
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
COPY .zshrc $HOME_USER/
COPY .p10k.zsh $HOME_USER/
RUN git clone --depth=1 https://github.com/romkatv/powerlevel10k.git $HOME_USER/.oh-my-zsh/themes/powerlevel10k
RUN git clone https://github.com/zsh-users/zsh-autosuggestions ~/.zsh/zsh-autosuggestions
RUN cd $HOME_USER/ && git clone --single-branch --branch dev https://github.com/spiritEcosse/scraper_etsy.git
USER root
WORKDIR $PROJ

# Set correct locale
RUN echo "LC_ALL=en_US.UTF-8" >> /etc/environment && \
    echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen && \
    echo "LANG=en_US.UTF-8" > /etc/locale.conf
RUN locale-gen en_US.UTF-8
ENV LC_CTYPE 'en_US.UTF-8'

#RUN sed -i "s/PasswordAuthentication no/PasswordAuthentication yes/" /etc/ssh/sshd_config
RUN rm -rf /run/nologin

COPY run.sh $HOME_USER/
RUN chmod +x $HOME_USER/run.sh
RUN chown igor:igor $HOME_USER/run.sh

ENTRYPOINT ["/home/igor/run.sh"]
RUN unset USER
