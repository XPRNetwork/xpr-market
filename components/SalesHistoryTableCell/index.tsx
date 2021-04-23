import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import TableDataCell from '../TableDataCell';
import { AvatarImage, ImageDataCell } from './SalesHistoryTableCell.styled';

export type BuyerContent = {
  avatar: string;
  buyer: string;
};

type Props = {
  id: string;
  content: string | BuyerContent;
};

const SalesHistoryTableCell = ({ id, content }: Props): JSX.Element => {
  const [isOnHover, setIsOnHover] = useState<boolean>(false);
  const router = useRouter();
  const addHoverState = () => setIsOnHover(true);
  const removeHoverState = () => setIsOnHover(false);
  switch (id) {
    case 'buyer': {
      const { avatar, buyer } = content as BuyerContent;
      const navigateToBuyer = () => router.push(`/user/${buyer}`);
      return (
        <>
          <ImageDataCell
            onMouseEnter={addHoverState}
            onMouseLeave={removeHoverState}
            onClick={navigateToBuyer}>
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
          <TableDataCell
            color={isOnHover ? '#752eeb' : '#1a1a1a'}
            onMouseEnter={addHoverState}
            onMouseLeave={removeHoverState}
            onClick={navigateToBuyer}>
            {buyer}
          </TableDataCell>
        </>
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
    default: {
      return content ? <TableDataCell>{content}</TableDataCell> : null;
    }
  }
};

export default SalesHistoryTableCell;
