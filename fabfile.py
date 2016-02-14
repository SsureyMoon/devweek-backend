from StringIO import StringIO
from fabric.api import cd, local, env, run
from fabric.colors import green
from fabric.context_managers import lcd, settings, shell_env, prefix
from fabric.contrib import files
from fabric.decorators import task
from fabric.operations import prompt, os, sudo
import fabtools
from fabtools.python import virtualenv
import sys
from fabtools.shorewall import Ping, SSH, HTTP, HTTPS, SMTP


@task
def devweek():
    env.server_name = 'devweek_emo'
    env.hosts = ['54.200.226.3', ]
    env.user = 'ubuntu'
    env.git_branch = 'master'
    # env.walkychat_config = {"ssh_keyfile_name": env.server_name}
    env.project_user = 'ubuntu'
    # env.db_user = 'walkychat_prototype_user'
    env.key_filename = "~/Documents/workspace/devweek/{}".format("emotolize_key.pem")

def install_packages():

    sudo('apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927')
    run('echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list')
    sudo('apt-get update')
    fabtools.require.deb.packages([
        "mongodb-org",
        "shorewall", "git"
    ])


    www = "/home/{user}/www/".format(user=env.project_user)
    run('mkdir -p ' + www)
    git_dir = www+'devweek_emo/'

    git_repo = "https://github.com/SsureyMoon/devweek-backend.git"
    if not files.exists(git_dir):
        fabtools.git.clone(git_repo, path=git_dir)
    else:
        with cd(git_dir):
            run('ls')
            fabtools.git.checkout('.')
            run('git fetch origin')

    if not fabtools.nodejs.version():
        fabtools.nodejs.install_from_source()

    fabtools.require.nginx.server()

    with cd(git_dir):
        fabtools.nodejs.install_dependencies()


def update_project():
    www = "/home/{user}/www/".format(user=env.project_user)
    run('mkdir -p ' + www)
    git_dir = www+'devweek_emo/'
    git_repo = "https://github.com/SsureyMoon/devweek-backend.git"

    with settings(user=env.project_user):
        if not files.exists(git_dir):
            fabtools.git.clone(git_repo, path=git_dir, use_sudo=True)
        else:
            with cd(git_dir):
                print "djgsljolkj"
                sudo('git checkout -- .')
                fabtools.git.checkout('.', use_sudo=True)
                sudo('git fetch origin')
                sudo('git pull')
                sudo ('chown {}:{} -R .'.format(env.project_user, env.project_user))
    with cd(git_dir):
        fabtools.nodejs.install_dependencies()
    sudo

def setup_nginx():
    www = "/home/{user}/www/".format(user=env.project_user)
    git_dir = www+'devweek_emo/'
    config_file = git_dir+'nginx/devweek.conf'
    sudo('cp {original} /etc/nginx/sites-available/{target}'\
        .format(original=config_file, target='54.200.226.3'))

    if files.exists('/etc/nginx/sites-enabled/{target}'\
        .format(target='54.200.226.3'), use_sudo=True):
        sudo('unlink /etc/nginx/sites-enabled/{target}'\
            .format(target='54.200.226.3'))
    sudo('ln -s /etc/nginx/sites-available/{target} /etc/nginx/sites-enabled/{target}'\
        .format(target='54.200.226.3'))

    if files.exists('/etc/nginx/sites-enabled/default', use_sudo=True):
        sudo('unlink /etc/nginx/sites-enabled/default')


    log_dir = '/etc/nginx/log/'
    if not files.exists(log_dir):
        sudo('mkdir -p ' + log_dir)
        sudo('touch {}local-wc.access.log'.format(log_dir))
        sudo('touch {}local-wc.error.log'.format(log_dir))

    if fabtools.service.is_running('nginx'):
        fabtools.service.restart('nginx')
    else:
        fabtools.service.start('nginx')


def run_supervisor(**kwargs):
    www = "/home/{user}/www/".format(user=env.project_user)
    git_dir = www+'devweek_emo/'
    log_dir = git_dir + 'logs/'
    with settings(user=env.project_user):
        if not files.exists(log_dir):
            run('mkdir -p ' + log_dir)
        
        concat = ",".join([key+"=\""+kwargs[key]+"\"" for key in kwargs])
        #with prefix(concat):
        with shell_env(**kwargs):
            fabtools.require.supervisor.process('node',
                environment=concat,#"NODE_ENV=%(ENV_NODE_ENV)s",
                command='node --harmony app.js',
                directory=git_dir,
                user=env.project_user,
                stdout_logfile=log_dir + 'node_stdout.log',
                stderr_logfile=log_dir + 'node_stderr.log',
                autorestart=True,
                redirect_stderr=True,
            )


def stop_supervisor(**kwargs):
    www = "/home/{user}/www/".format(user=env.project_user)
    git_dir = www+'devweek_emo/'
    log_dir = git_dir + 'logs/'
    with cd(git_dir):
        with shell_env(**kwargs):
            fabtools.supervisor.stop_process('node')


@task
def setup(**kwargs):
    # install_packages()
    update_project()
    setup_nginx()
    stop_supervisor()
    run_supervisor(**kwargs)

@task
def rerun(**kwargs):
    update_project()
    stop_supervisor()
    run_supervisor(**kwargs)

@task
def view_debug():
    www = "/home/{user}/www/".format(user=env.project_user)
    git_dir = www+'devweek_emo/'
    log_dir = git_dir + 'logs/'
    stdout_debugfile=log_dir + 'node_stdout.log'
    run('cat '+stdout_debugfile)
