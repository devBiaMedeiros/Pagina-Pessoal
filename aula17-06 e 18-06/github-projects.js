// Script para carregar repositórios do GitHub

const GITHUB_USER = 'devBiaMedeiros';
const GITHUB_API = `https://api.github.com/users/${GITHUB_USER}/repos`;

// Função para formatar a data
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Função para contar estrelas
function getStargazers(stars) {
    if (stars === 0) return '';
    if (stars < 1000) return `⭐ ${stars}`;
    return `⭐ ${(stars / 1000).toFixed(1)}k`;
}

// Função para obter cor da linguagem
function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'TypeScript': '#2b7489',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'React': '#61dafb'
    };
    return colors[language] || '#858585';
}

// Função para carregar repositórios
async function loadRepositories() {
    try {
        const response = await fetch(GITHUB_API);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar repositórios');
        }

        const repos = await response.json();
        
        // Filtrar repositórios públicos e ordenar por atualização mais recente
        const publicRepos = repos
            .filter(repo => !repo.fork) // Excluir forks
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 6); // Pegar apenas os 6 mais recentes

        displayRepositories(publicRepos);
    } catch (error) {
        console.error('Erro:', error);
        const reposContainer = document.getElementById('github-repos');
        reposContainer.innerHTML = `
            <p class="loading" style="color: #d9534f; grid-column: 1 / -1;">
                Erro ao carregar repositórios. Por favor, tente novamente mais tarde.
            </p>
        `;
    }
}

// Função para exibir repositórios
function displayRepositories(repos) {
    const reposContainer = document.getElementById('github-repos');
    
    if (repos.length === 0) {
        reposContainer.innerHTML = `
            <p class="loading" style="grid-column: 1 / -1;">
                Nenhum repositório público encontrado.
            </p>
        `;
        return;
    }

    const reposHTML = repos.map(repo => `
        <div class="github-repo">
            <h3>
                <a href="${repo.html_url}" target="_blank" style="color: #7a4eb7; text-decoration: none;">
                    🔗 ${repo.name}
                </a>
            </h3>
            <p>${repo.description || 'Sem descrição disponível'}</p>
            
            <div class="repo-meta">
                ${repo.language ? `<span class="repo-language">${repo.language}</span>` : ''}
                ${getStargazers(repo.stargazers_count) ? `<span class="repo-stat">${getStargazers(repo.stargazers_count)}</span>` : ''}
                ${repo.forks_count > 0 ? `<span class="repo-stat">🍴 ${repo.forks_count}</span>` : ''}
            </div>
            
            <p style="font-size: 0.85em; color: #999; margin-top: 10px;">
                Atualizado em ${formatDate(repo.updated_at)}
            </p>
            
            <a href="${repo.html_url}" target="_blank" style="color: #7a4eb7;">
                Ver no GitHub →
            </a>
        </div>
    `).join('');

    reposContainer.innerHTML = reposHTML;
}

// Carregar repositórios quando a página carregar
document.addEventListener('DOMContentLoaded', loadRepositories);
