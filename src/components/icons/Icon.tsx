import AddIcon from './AddIcon'
import UserIcon from './UserIcon'
import AltArrowDownIcon from './AltArrowDownIcon'
import HomeIcon from './HomeIcon'
import ArrowLeftIcon from './ArrowLeftIcon'
import ArrowRightIcon from './ArrowRightIcon'
import CloseIcon from './CloseIcon'
import GoogleIcon from './GoogleIcon'
import ArrowRightUpIcon from './ArrowRightUpIcon'
import ChatLineIcon from './ChatLineIcon'
import CheckCircleIcon from './CheckCircleIcon'
import CheckIcon from './CheckIcon'
import CircleIcon from './CircleIcon'
import EyeIcon from './EyeIcon'
import EyeOffIcon from './EyeOffIcon'
import FacebookIcon from './FacebookIcon'
import HorizontalDotMenuIcon from './HorizontalDotMenuIcon'
import ProgressIcon from './ProgressIcon'
import TrashIcon from './TrashIcon'

const Icon = {
  Add: (props: React.ComponentProps<typeof AddIcon>) => <AddIcon {...props} />,
  AltArrowDown: (props: React.ComponentProps<typeof AltArrowDownIcon>) => <AltArrowDownIcon {...props} />,
  ArrowLeft: (props: React.ComponentProps<typeof ArrowLeftIcon>) => <ArrowLeftIcon {...props} />,
  ArrowRight: (props: React.ComponentProps<typeof ArrowRightIcon>) => <ArrowRightIcon {...props} />,
  ArrowRightUp: (props: React.ComponentProps<typeof ArrowRightUpIcon>) => <ArrowRightUpIcon {...props} />,
  ChatLine: (props: React.ComponentProps<typeof ChatLineIcon>) => <ChatLineIcon {...props} />,
  CheckCircle: (props: React.ComponentProps<typeof CheckCircleIcon>) => <CheckCircleIcon {...props} />,
  Check: (props: React.ComponentProps<typeof CheckIcon>) => <CheckIcon {...props} />,
  Circle: (props: React.ComponentProps<typeof CircleIcon>) => <CircleIcon {...props} />,
  Close: (props: React.ComponentProps<typeof CloseIcon>) => <CloseIcon {...props} />,
  Eye: (props: React.ComponentProps<typeof EyeIcon>) => <EyeIcon {...props} />,
  EyeOff: (props: React.ComponentProps<typeof EyeOffIcon>) => <EyeOffIcon {...props} />,
  Facebook: (props: React.ComponentProps<typeof FacebookIcon>) => <FacebookIcon {...props} />,
  Google: (props: React.ComponentProps<typeof GoogleIcon>) => <GoogleIcon {...props} />,
  Home: (props: React.ComponentProps<typeof HomeIcon>) => <HomeIcon {...props} />,
  HorizontalDotMenu: (props: React.ComponentProps<typeof HorizontalDotMenuIcon>) => <HorizontalDotMenuIcon {...props} />,
  Progress: (props: React.ComponentProps<typeof ProgressIcon>) => <ProgressIcon {...props} />,
  Trash: (props: React.ComponentProps<typeof TrashIcon>) => <TrashIcon {...props} />,
  User: (props: React.ComponentProps<typeof UserIcon>) => <UserIcon {...props} />
}

export default Icon
