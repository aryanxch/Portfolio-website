interface ProjectItemProps {
  title: string;
  technologies: string;
  date: string;
  description: string;
}

const ProjectItem = ({ title, technologies, date, description }: ProjectItemProps) => {
  return (
    <div className="mb-8">
      <div className="mb-2">
        <h4 className="text-base font-medium mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">
          {technologies} • {date}
        </p>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ProjectItem;