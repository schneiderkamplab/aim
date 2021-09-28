import React, { memo, useEffect } from 'react';
import { isEmpty } from 'lodash-es';

import BusyLoaderWrapper from 'components/BusyLoaderWrapper/BusyLoaderWrapper';
import tagsAppModel from 'services/models/tags/tagsAppModel';
import TagRunsTable from './TagRunsTable';
import EmptyComponent from 'components/EmptyComponent/EmptyComponent';
import Icon from 'components/Icon/Icon';
import Button from 'components/Button/Button';
import TagLabel from 'components/TagLabel/TagLabel';
import { ITagDetailProps } from 'types/pages/tags/Tags';

import './Tags.scss';

function TagDetail({
  id,
  onSoftDeleteModalToggle,
  onUpdateModalToggle,
  onDeleteModalToggle,
  isTagInfoDataLoading,
  tagInfo,
  isRunsDataLoading,
  tagRuns,
}: ITagDetailProps): React.FunctionComponentElement<React.ReactNode> {
  useEffect(() => {
    const tagRequestRef = tagsAppModel.getTagById(id);
    const tagRunsRequestRef = tagsAppModel.getTagRuns(id);
    tagRunsRequestRef.call();
    tagRequestRef.call();
    return () => {
      tagRunsRequestRef.abort();
      tagRequestRef.abort();
    };
  }, [id]);

  return (
    <div className='TagDetail'>
      <div className='TagDetail__headerContainer'>
        <BusyLoaderWrapper
          isLoading={isTagInfoDataLoading}
          loaderType='skeleton'
          loaderConfig={{ variant: 'rect', width: 100, height: 24 }}
          width='auto'
        >
          {tagInfo && (
            <TagLabel
              size='medium'
              color={tagInfo?.color}
              label={tagInfo?.name}
            />
          )}
        </BusyLoaderWrapper>
        <div className='TagDetail__headerContainer__headerActionsBox'>
          {!tagInfo?.archived && (
            <Button withOnlyIcon={true} onClick={onUpdateModalToggle}>
              <Icon name='edit' />
            </Button>
          )}
          {tagInfo?.archived ? (
            <Button onClick={onSoftDeleteModalToggle} withOnlyIcon={true}>
              <Icon name='eye-show-outline' color='primary' />
            </Button>
          ) : (
            <Button withOnlyIcon={true} onClick={onSoftDeleteModalToggle}>
              <Icon name='eye-outline-hide' color='primary' />
            </Button>
          )}
          <Button withOnlyIcon={true} onClick={onDeleteModalToggle}>
            <Icon name='delete' fontSize='small' color='primary' />
          </Button>
        </div>
      </div>
      <BusyLoaderWrapper
        isLoading={isRunsDataLoading}
        className='Tags__TagList__tagListBusyLoader'
      >
        {!isEmpty(tagRuns) ? (
          <TagRunsTable runsList={tagRuns} />
        ) : (
          <EmptyComponent size='big' content='No Runs' />
        )}
      </BusyLoaderWrapper>
    </div>
  );
}

export default memo(TagDetail);