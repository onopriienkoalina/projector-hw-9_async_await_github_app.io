'use strict';

// Workshop: GitHub search (Github API)

// Github
// UI

const GITHUB_API = 'https://api.github.com/';
const searchUser = document.querySelector('.searchUser');

// https://api.github.com/users/username
// https://api.github.com/users/username?client_id=d9308aacf8b204d361fd&client_secret=84969aeef73956f4ec9e8716d1840532802bb81b

class Github {
    constructor() {
        this.clientId = '497fa293fac59c2e9aad';
        this.clientSecret = '31290a9ad2b39b91b4dfee9606cb29d8b081fc29';
    }

    // https://api.github.com/
    async getUser(userName) {
        const response = await fetch(`${GITHUB_API}users/${userName}?client_id=${this.clientId}&client_secret=${this.clientSecret}`);
        const user = await response.json();
        return user;
    }
    async getRepos(userName) {
        const response = await fetch(`${GITHUB_API}users/${userName}/repos?per_page=5&sort=created:asc&client_id=${this.clientId}&client_secret=${this.clientSecret}`);
        const repos = await response.json();
        return repos.slice(0,5);
    }
}

class UI {
    constructor() {
        this.profile = document.querySelector('.profile');
    }

    async showProfile(user) {
        this.profile.innerHTML = `
        <div class="card card-body mb-3">
        <div class="row">
          <div class="col-md-3">
            <img class="img-fluid mb-2" src="${user.avatar_url}">
            <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
          </div>
          <div class="col-md-9">
            <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
            <span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
            <span class="badge badge-success">Followers: ${user.followers}</span>
            <span class="badge badge-info">Following: ${user.following}</span>
            <br><br>
            <ul class="list-group">
              <li class="list-group-item">Company: ${user.company}</li>
              <li class="list-group-item">Website/Blog: ${user.blog}</li>
              <li class="list-group-item">Location: ${user.location}</li>
              <li class="list-group-item">Member Since: ${user.created_at}</li>
            </ul>
          </div>
        </div>
      </div>
      <h3 class="page-heading mb-3">Latest Repos</h3>
      <div class="repos"></div>
        `;
        try{
            const repos = await github.getRepos(user.login)
        } catch(error){
            console.error(error);
        }
    }

    showAlert(message, className) {
        this.clearAlert();

        const div = document.createElement('div');
        div.className = className;
        div.innerHTML = message;

        const search = document.querySelector('.search');
        search.before(div);

        setTimeout(() => {
            this.clearAlert()
        }, 3000)
    }

    clearAlert() {
        const alert = document.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
    }

    clearProfile() {
        this.profile.innerHTML = '';
    }

    async showRepos (repos) {
        const reposDiv = document.createElement('div');
        reposDiv.innerHTML = '';

        repos.forEach(repo => {
            const repoDiv = document.createElement('div');
            repoDiv.classList.add('card', 'card-body', 'mb-2');
            repoDiv.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </div>
                <div class="col-md-6">
                    <span class="bange bange-primary">Stars: ${repo.stargazers_count}</span>
                    <span class="bange bange-secondary">Watchers: ${repo.watchers_count}</span>
                    <span class="bange bange-success">Forks: ${repo.forks_count}</span>
                </div>
            </div>
            `;
            reposDiv.appendChild(repoDiv);
        });

        this.profile.querySelector('.repos').appendChild(reposDiv);
    }
}

const github = new Github();
const ui = new UI();

function debounce(searchUser, timeout = 500){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { searchUser.apply(this, args); }, timeout);
    };
}
function saveInput(){
console.log('Saving data');
}
const processChange = debounce(() => saveInput());

searchUser.addEventListener('keyup', debounce(async (event) => {
    const userText = event.target.value.trim();
  
    if (userText !== '') { 
      try {
        const user = await github.getUser(userText);
        const repos = await github.getRepos(userText);
  
        ui.showProfile(user);
        ui.showRepos(repos);
      } catch (error) {
        ui.showAlert('User not found', 'alert alert-danger');
      }
    } else {
      ui.clearProfile();
    }
  }));

