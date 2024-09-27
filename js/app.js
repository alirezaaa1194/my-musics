const container = document.querySelector(".container");
const musicModal = document.querySelector(".music-modal");
const closeModalBtn = document.querySelector(".close-modal-btn");
const musicNameInput = document.querySelector(".music-name-input");
const musicLinkInput = document.querySelector(".music-link-input");
const musicFileInput = document.querySelector(".music-file-input");
const addMusicBtn = document.querySelector(".add-music-btn");
const overlay = document.querySelector(".overlay");
const openMusicModalBtn = document.querySelector(".open-music-modal-btn");
const loader = document.querySelector(".loader");

const openModal = () => {
  musicModal.classList.add("active");
  overlay.classList.add("active");
};

const closeModal = () => {
  musicModal.classList.remove("active");
  overlay.classList.remove("active");

  musicNameInput.value = "";
  musicLinkInput.value = "";
  musicFileInput.value = "";
};

const getMusics = async () => {
  const res = await fetch(`https://musics.liara.run/musics`);
  const datas = await res.json();

  musicsGenerator(datas);
};

const musicsGenerator = (musics) => {
  container.innerHTML = "";
  musics.forEach((music) => {
    container.insertAdjacentHTML(
      "beforeend",
      `
    <div class="box">
        <p class="music-name">${music.name}</p>
        <audio src="${music.src}" controls></audio>
        <button class="remove-music-btn" id="${music.id}">حذف</button>
      </div>
    `
    );
  });
  const removeMusicBtns = document.querySelectorAll(".remove-music-btn");
  removeMusicBtns.forEach((btn) => {
    btn.addEventListener("click", () => removeMusicHandler(btn.id));
  });
  loader.classList.add('hide')
};

const removeMusicHandler = async (id) => {
  let wantRemove = confirm("آیا میخواهید آهنگ را حذف کنید؟ ");
  if (wantRemove) {
    const res = await fetch(`https://musics.liara.run/musics/${id}`, { method: "DELETE" });
    loader.classList.remove('hide')
    getMusics();
  }
};

let src = null;

const addMusicHandler = async () => {
  if (musicNameInput.value.trim() && (musicFileInput.value.trim() || musicLinkInput.value.trim())) {
    if ((musicLinkInput.value.trim() && !musicFileInput.value.trim()) || (!musicLinkInput.value.trim() && musicFileInput.value.trim())) {
      let newMusicInfo = {
        name: musicNameInput.value.trim(),
        src,
      };

      const res = await fetch(`https://musics.liara.run/musics`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newMusicInfo) });
      console.log(res);
    } else {
      alert("لطفا یکی از فیلد هارا پرکنید");
    }
  } else {
    alert("لطفا فیلد هارا پرکنید");
  }
};

window.addEventListener("load", () => {
  getMusics();
});

musicFileInput.addEventListener("change", (e) => {
  let input = document.getElementById("music-file-input").files[0];

  let reader = new FileReader();

  reader.onload = function (e) {
    src = e.target.result;
  };

  reader.readAsDataURL(input);
});

musicLinkInput.addEventListener("input", () => {
  src = musicLinkInput.value.trim();
});

openMusicModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
addMusicBtn.addEventListener("click", addMusicHandler);
