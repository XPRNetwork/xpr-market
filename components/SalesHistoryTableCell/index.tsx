import TableDataCell from '../TableDataCell';
import Image from 'next/image';
import Link from 'next/link';
import { AvatarImage, ImageDataCell } from './SalesHistoryTableCell.styled';
import { useRouter } from 'next/router';

export type ImgContent = {
  avatar: string;
  buyer: string;
};

type Props = {
  id: string;
  content: string | ImgContent;
};

const SalesHistoryTableCell = ({ id, content }: Props): JSX.Element => {
  const router = useRouter();
  switch (id) {
    case 'img': {
      const { avatar, buyer } = content as ImgContent;
      return (
        <ImageDataCell onClick={() => router.push(`/my-items/${buyer}`)}>
          <AvatarImage
            priority
            width={32}
            height={32}
            src={
              avatar
                ? `data:image/jpeg;base64,${avatar}`
                : '/default-avatar.png'
            }
          />
        </ImageDataCell>
      );
    }
    case 'serial': {
      return <TableDataCell>#{content}</TableDataCell>;
    }
    case 'tx': {
      return (
        <ImageDataCell align="left">
          <Link
            href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}${content}`}
            passHref>
            <a target="_blank" rel="noreferrer">
              <Image
                layout="fixed"
                priority
                width={24}
                height={24}
                src="/launch.svg"
              />
            </a>
          </Link>
        </ImageDataCell>
      );
    }
    case 'buyer': {
      return (
        <TableDataCell onClick={() => router.push(`/my-items/${content}`)}>
          {content}
        </TableDataCell>
      );
    }
    default: {
      return <TableDataCell>{content}</TableDataCell>;
    }
  }
};

export default SalesHistoryTableCell;
