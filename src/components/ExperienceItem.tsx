interface ExperienceItemProps {
  title: string;
  company: string;
  period: string;
  description: string;
}

const ExperienceItem = ({ title, company, period, description }: ExperienceItemProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-base font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
        <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
          {period}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ExperienceItem;