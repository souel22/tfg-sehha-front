// ConsultationHeader Component
const ConsultationHeader = ({ specialty, doctorName }) => (
  <div className="consultation-header">
    {specialty} - Appointment with Dr. {doctorName}
  </div>
);
export default ConsultationHeader;
