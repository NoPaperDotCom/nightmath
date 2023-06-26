export const whatsapp = ({ phone = false, text = "" }) => {
  const arr = [];
  if (phone && phone.length > 0) { arr.push(`phone=${phone}`)}
  if (text && text.length > 0) { arr.push(`text=${text}`)}
  const _whatsppLink = `https://api.whatsapp.com/send?${arr.join("&")}`;
  return window.open(_whatsppLink, "_blank");
};

export const share = ({ socialMedia = "facebook", url = "" }) => {
  const _socialMedia = socialMedia.toLowerCase();
  if (_socialMedia === "facebook" || _socialMedia === "fb") {
    return window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  }

  if (_socialMedia === "whatsapp") {
    return window.open(`https://api.whatsapp.com/send?text=${url}`, "_blank");  
  }

  if (_socialMedia === "twitter") {
    window.open(`https://twitter.com/intent/tweet?text=${url}`, "_blank");
  }

  return false;
};
