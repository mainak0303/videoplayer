import { ButtonGroup, Button } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ view, onChange }) => {
  return (
    <ButtonGroup sx={{ mb: 2 }}>
      <Button
        variant={view === 'grid' ? 'contained' : 'outlined'}
        onClick={() => onChange('grid')}
        startIcon={<GridViewIcon />}
      >
        Grid
      </Button>
      <Button
        variant={view === 'list' ? 'contained' : 'outlined'}
        onClick={() => onChange('list')}
        startIcon={<TableRowsIcon />}
      >
        List
      </Button>
    </ButtonGroup>
  );
};