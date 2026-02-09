const clientId = "1401663809164410971"; // your client ID
const redirectUri = window.location.origin + "/about.html";
const scopes = ["identify"];

function getTokenFromUrl() {
  const hash = window.location.hash;
  if (hash.includes("access_token")) {
    const params = new URLSearchParams(hash.substr(1));
    return params.get("access_token");
  }
  return null;
}

function redirectToDiscordOAuth() {
  const authUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scopes.join('%20')}`;
  window.location.href = authUrl;
}

function fetchDiscordUser(token) {
  fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((user) => {
      const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
      const pfp = document.getElementById("pfp");
      const loginBtn = document.getElementById("loginBtn");

      pfp.src = avatarUrl;
      localStorage.setItem("pfp", avatarUrl);

      // Hide login button
      if (loginBtn) loginBtn.style.display = "none";

      // Show username
      const usernameTag = document.createElement("p");
      usernameTag.textContent = user.username;
      usernameTag.style.margin = "0";
      usernameTag.style.color = "#00f7ff";
      usernameTag.style.fontSize = "0.9rem";
      document.querySelector(".profile").appendChild(usernameTag);
    });
}

// On load
window.addEventListener("load", () => {
  const token = getTokenFromUrl();
  if (token) {
    window.location.hash = "";
    fetchDiscordUser(token);
  } else {
    const stored = localStorage.getItem("pfp");
    if (stored) {
      document.getElementById("pfp").src = stored;
      const loginBtn = document.getElementById("loginBtn");
      if (loginBtn) loginBtn.style.display = "none";
    }
  }

  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", redirectToDiscordOAuth);
  }
});
