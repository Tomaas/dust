import {
  ArrowUpIcon,
  AttachmentIcon,
  Button,
  FullscreenExitIcon,
  FullscreenIcon,
  IconButton,
} from "@dust-tt/sparkle";
import {
  AgentConfigurationType,
  AgentMention,
  WorkspaceType,
} from "@dust-tt/types";
import React, { useRef, useState } from "react";

import { AssistantPicker } from "@app/components/assistant/AssistantPicker";
import { classNames } from "@app/lib/utils";

import InputBarEditorContent from "./inputBarEditorContent";
import useAssistantSuggestions from "./useAssistantSuggestions";
import useCustomEditor, { CustomEditorProps } from "./useCustomEditor";
import useHandleMentions from "./useHandleMentions";

export interface InputBarContainerProps {
  allAssistants: AgentConfigurationType[];
  agentConfigurations: AgentConfigurationType[];
  disableAttachment: boolean;
  onEnterKeyDown: CustomEditorProps["onEnterKeyDown"];
  onInputFileChange: (e: React.ChangeEvent) => void;
  owner: WorkspaceType;
  selectedAssistant: AgentMention | null;
  stickyMentions: AgentMention[] | undefined;
}

const InputBarContainer = ({
  allAssistants,
  agentConfigurations,
  disableAttachment,
  onEnterKeyDown,
  onInputFileChange,
  owner,
  selectedAssistant,
  stickyMentions,
}: InputBarContainerProps) => {
  const suggestions = useAssistantSuggestions(agentConfigurations);

  const [isExpanded, setIsExpanded] = useState(false);
  function handleExpansionToggle() {
    setIsExpanded((currentExpanded) => !currentExpanded);

    // Focus at the end of the document when toggling expansion.
    editorService.focusEnd();
  }

  function resetEditorContainerSize() {
    setIsExpanded(false);
  }

  const { editor, editorService } = useCustomEditor({
    suggestions,
    onEnterKeyDown,
    resetEditorContainerSize,
  });

  useHandleMentions(
    editorService,
    agentConfigurations,
    stickyMentions,
    selectedAssistant
  );

  // TODO: Reset after loading.
  const fileInputRef = useRef<HTMLInputElement>(null);

  const contentEditableClasses = classNames(
    "inline-block w-full",
    "border-0 pr-1 pl-2 sm:pl-0 outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 py-1.5",
    "whitespace-pre-wrap font-normal"
  );

  return (
    <div className="flex w-full flex-1 whitespace-pre-wrap border-0 py-2 pl-2 pr-1 font-normal outline-none ring-0 scrollbar-hide focus:border-0 focus:outline-none focus:ring-0 sm:pl-0">
      <InputBarEditorContent
        editor={editor}
        className={classNames(
          contentEditableClasses,
          "scrollbar-hide",
          "overflow-y-auto",
          isExpanded
            ? "h-[60vh] max-h-[60vh] lg:h-[80vh] lg:max-h-[80vh]"
            : "max-h-64"
        )}
      />

      <div className="flex flex-row items-end justify-between gap-2 self-stretch border-t border-structure-100 pr-1 sm:flex-col sm:border-0">
        <div className="flex gap-5 rounded-full border border-structure-100 px-4 py-2 sm:gap-3 sm:px-2">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={onInputFileChange}
          />
          <IconButton
            variant={"tertiary"}
            icon={AttachmentIcon}
            size="sm"
            disabled={disableAttachment}
            tooltip="Add a document to the conversation (10MB maximum, only .txt, .pdf, .md)."
            tooltipPosition="above"
            className="flex"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          />
          <AssistantPicker
            owner={owner}
            size="sm"
            onItemClick={(c) => {
              editorService.insertMention({ id: c.sId, label: c.name });
            }}
            assistants={allAssistants}
            showBuilderButtons={true}
          />
          <div className="hidden sm:flex">
            <IconButton
              variant={"tertiary"}
              icon={isExpanded ? FullscreenExitIcon : FullscreenIcon}
              size="sm"
              className="flex"
              onClick={handleExpansionToggle}
            />
          </div>
        </div>
        <Button
          size="sm"
          icon={ArrowUpIcon}
          label="Send"
          disabled={editorService.isEmpty()}
          labelVisible={false}
          disabledTooltip
          onClick={async () => {
            const jsonContent = editorService.getTextAndMentions();
            onEnterKeyDown(editorService.isEmpty(), jsonContent, () => {
              editorService.clearEditor();
              resetEditorContainerSize();
            });
          }}
        />
      </div>
    </div>
  );
};

export default InputBarContainer;