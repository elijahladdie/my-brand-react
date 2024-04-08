
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours() > 12 ? (date.getHours() - 12).toString().padStart(2, '0') : date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const period = date.getHours() >= 12 ? 'PM' : 'AM';

  return `${year}-${month}-${day} ${hour}:${minute} ${period}`;
}


export const getInitials = (fullName) => {
  const nameParts = fullName.split(" ");
  const firstInitial = nameParts[0].charAt(0).toUpperCase();

  if (nameParts.length === 1) {
    return (<span className="text-white text-lg  font-bold ">{firstInitial}</span>);
  }

  const secondInitial = nameParts[1].charAt(0).toUpperCase();

  return (<div className="flex rounded ">
    <span className="text-gray text-sm  font-bold">{firstInitial}</span>
    <span className="text-white text-sm  font-bold">{secondInitial}</span>
  </div>);
};