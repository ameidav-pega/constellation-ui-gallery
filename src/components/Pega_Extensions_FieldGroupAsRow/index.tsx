import { FieldGroup, Flex, Configuration, useTheme } from '@pega/cosmos-react-core';
import StyledPegaExtensionsFieldGroupAsRowWrapper from './styles';

interface FieldGroupAsRowProps {
  heading: string;
  children: any;
}

export default function PegaExtensionsFieldGroupAsRow(props: FieldGroupAsRowProps) {
  const { heading, children } = props;
  const theme = useTheme();
  return (
    <Configuration>
      <FieldGroup name={heading}>
        <StyledPegaExtensionsFieldGroupAsRowWrapper theme={theme}>
          {children.map((child: any, i: number) => (
            <Flex container={{ direction: 'column' }} key={`r-${i + 1}`}>
              {child}
            </Flex>
          ))}
        </StyledPegaExtensionsFieldGroupAsRowWrapper>
      </FieldGroup>
    </Configuration>
  );
}
