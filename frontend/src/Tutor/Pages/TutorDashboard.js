import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TutorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [feedbackRequests, setFeedbackRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutorDashboardData = async () => {
      try {
        // Simulate an API call with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock tutor dashboard data
        const mockData = {
          projects: [
            {
              id: 1,
              title: 'AI Farming Solution',
              students: [{ name: 'Alice' }, { name: 'Bob' }],
              mentorRequests: ['Request from Charlie', 'Request from Dave'],
            },
            {
              id: 2,
              title: 'Weather Prediction Model',
              students: [{ name: 'Eve' }],
              mentorRequests: [],
            },
          ],
          challenges: [
            { id: 1, title: 'Coding Challenge #1', company: 'Tech Company A' },
            { id: 2, title: 'Data Science Challenge', company: 'Tech Company B' },
          ],
          feedbackRequests: [
            { studentName: 'Alice', projectTitle: 'AI Farming Solution', projectId: 1 },
            { studentName: 'Eve', projectTitle: 'Weather Prediction Model', projectId: 2 },
          ],
        };

        setProjects(mockData.projects);
        setChallenges(mockData.challenges);
        setFeedbackRequests(mockData.feedbackRequests);
      } catch (err) {
        setError('Failed to fetch tutor dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchTutorDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="tutor-dashboard p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Tutor Dashboard</h1>

      {/* Projects You're Guiding */}
      <section className="guiding-projects mb-8">
        <h2 className="text-xl font-semibold mb-4">Projects You’re Guiding</h2>
        {projects.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <li key={project.id} className="project-card bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">
                  <Link to={`/project/${project.id}`} className="text-blue-500 hover:underline">
                    {project.title}
                  </Link>
                </h3>
                <p className="text-gray-700 mt-2">Students Assigned:</p>
                <ul className="student-list ml-4 list-disc list-inside">
                  {project.students.map((student, i) => (
                    <li key={i} className="text-gray-600">{student.name}</li>
                  ))}
                </ul>
                {project.mentorRequests.length > 0 ? (
                  <p className="text-gray-700 mt-2">Mentor Requests: {project.mentorRequests.length}</p>
                ) : (
                  <p className="text-gray-500 mt-2">No mentor requests.</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No projects assigned to you yet.</p>
        )}
      </section>

      {/* Active Challenges */}
      <section className="active-challenges mb-8">
        <h2 className="text-xl font-semibold mb-4">Challenges</h2>
        {challenges.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((challenge) => (
              <li key={challenge.id} className="challenge-card bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">
                  <Link to={`/challenge/${challenge.id}`} className="text-blue-500 hover:underline">
                    {challenge.title}
                  </Link>
                </h3>
                <p className="text-gray-700">Posted by: {challenge.company}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No active challenges at the moment.</p>
        )}
      </section>

      {/* Feedback Section */}
      <section className="feedback-section">
        <h2 className="text-xl font-semibold mb-4">Feedback Section</h2>
        {feedbackRequests.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbackRequests.map((submission, index) => (
              <li key={index} className="feedback-card bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-700">Submission by: {submission.studentName}</p>
                <p className="text-gray-700">Project: {submission.projectTitle}</p>
                <Link to={`/project/${submission.projectId}`} className="text-blue-500 hover:underline mt-2 inline-block">
                  View Submission
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No submissions awaiting feedback.</p>
        )}
      </section>
    </div>
  );
};

export default TutorDashboard;
