document.querySelectorAll('.toggle-password').forEach((eyeIcon) => {
  eyeIcon.addEventListener('click', () => {
    const targetId = eyeIcon.getAttribute('data-target');
    const input = document.getElementById(targetId);

    if (input.type === 'password') {
input.type = 'text';
eyeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18M9.879 9.88a3 3 0 0 0 4.242 4.242M6.228 6.228C4.936 7.566 3.78 9.33 3 12c1.292 3.338 5.31 6.5 9 6.5a8.956 8.956 0 0 0 3.272-.6M14.121 14.122L21 21M17.772 17.772A10.45 10.45 0 0 0 21 12c-1.292-3.338-5.31-6.5-9-6.5a8.96 8.96 0 0 0-3.273.6" /></svg>'; // change icon when showing password
    } else {
      input.type = 'password';
      eyeIcon.textContent = '👁‍🗨'; // change back when hiding
    }
  });
});
