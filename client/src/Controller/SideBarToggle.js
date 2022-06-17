export const SideBarToggle = (id) => {
  return () => {
    const el = document.getElementById(id);

    el.classList.toggle("hidden");
  };
};
