import { FiHome, FiUsers, FiUser, FiMapPin } from "react-icons/fi";

const statsData = [
  { icon: <FiHome />, value: "500+", label: "Logements disponibles" },
  { icon: <FiUsers />, value: "200+", label: "Propriétaires inscrits" },
  { icon: <FiUser />, value: "1000+", label: "Clients satisfaits" },
  { icon: <FiMapPin />, value: "14", label: "Villes au Sénégal" },
];

function Stats() {
  return (
    <section className="stats">
      {statsData.map((stat, index) => (
        <div className="stat-item" key={index}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-text">
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

export default Stats;