// ConsultationHeader Component
const ConsultationHeader = ({ specialty, user }) => (
  <div className="consultation-header">
    {specialty} Appointment with Patient {user}
  </div>
);
export default ConsultationHeader;
