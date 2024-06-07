import { Dispatch, SetStateAction } from 'react';
import { deleteMilestone } from '../../rest/service';
import { toast } from 'react-toastify';
import { IMilestone } from '../../rest/types';

export function MilestoneSettings({ milestones, setUpdated }: { milestones: IMilestone[] | undefined; setUpdated: Dispatch<SetStateAction<boolean>>; }) {
  return <div>
    <h3>Milestone Overview</h3>
    {milestones &&
      <table className='user-overview'>
        <tr>
          <th>Milestone</th>
          <th>Student Count</th>
          <th></th>
        </tr>
        {milestones.map((milestone) => <tr>
          <td>
            {milestone.name}
          </td>
          <td>
            <center>{milestone.students.length}</center>
          </td>
          <td className='edit-box'>
            <div>
              <button style={{ width: "2.5em" }} onClick={() => requestMilestoneDeletion(milestone, (update) => setUpdated(update))}>🗑</button>
            </div>
          </td>
        </tr>)}
      </table>}
    {!milestones &&
      <p>There are no milestones.</p>}
  </div>;
}

function requestMilestoneDeletion(milestone: IMilestone, update: Dispatch<SetStateAction<boolean>>) {
  deleteMilestone(milestone.name).then(res => {
    if (res && res.ok) {
      toast(`Successfully deleted milestone ${milestone.name}.`, { autoClose: 1500 });
      update(true);
    } else {
      toast.error(`Failed deleting user ${milestone.name}.`);
    }
  });
}
